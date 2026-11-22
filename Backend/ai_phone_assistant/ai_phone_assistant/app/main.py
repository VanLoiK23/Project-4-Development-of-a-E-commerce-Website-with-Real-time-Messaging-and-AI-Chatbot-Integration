import os
import re
import json
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
from langchain_core.messages import HumanMessage, AIMessage
from app.retriever.hybrid_retriever import create_hybrid_retriever
from app.agent.agent import get_agent_executor
from app.model.base_model import ProductCardData,ChatRequest, ChatResponse
from app.repository.ingestion_pipeline import run_ingestion_pipeline
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AI Chatbot API", description="Backend for E-commerce Chatbot")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

agent_executor = None
chat_history_memory = {} # Lưu lịch sử chat tạm thời (Key: session_id, Value: list messages)

# Sự kiện khởi động Server
@app.on_event("startup")
async def startup_event():
    global agent_executor
    print("🚀 Đang khởi động Server và nạp dữ liệu AI...")
    run_ingestion_pipeline()  # Chạy pipeline nhập liệu (nếu cần)

    # 1. Tạo Retriever (Chạy 1 lần khi start server)
    retriever = create_hybrid_retriever()
    if not retriever:
        print("🔴 LỖI: Không thể khởi tạo Retriever.")
        return

    # 2. Tạo Agent
    agent_executor = get_agent_executor(retriever)
    print("✅ Server đã sẵn sàng! Agent đã được nạp.")

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    global agent_executor
    
    if not agent_executor:
        raise HTTPException(status_code=500, detail="AI Agent chưa sẵn sàng. Vui lòng thử lại sau.")

    session_id = request.session_id
    question = request.message
    user_id = request.userId

    # 1. Lấy lịch sử chat của session này (nếu chưa có thì tạo mới)
    if session_id not in chat_history_memory:
        chat_history_memory[session_id] = []
    
    current_history = chat_history_memory[session_id]

    try:
        print(f"📩 Nhận câu hỏi từ {session_id}: {question}")

        if user_id:
            # Chúng ta sửa lại input gửi cho Agent
            # Agent sẽ đọc được dòng này nhưng khách hàng thì không thấy
            agent_input = f"{{system_note: Khách hàng này có ID là '{user_id}'. Nếu cần tra cứu lịch sử địa chỉ hoặc đặt đơn hàng, hãy dùng ID này ngay lập tức.}} \n\n Khách hỏi: {question}"
        else:
            agent_input = question

        print(f"📩 Input gửi Agent: {agent_input}")
        
        # 2. Gọi Agent xử lý
        response_data = agent_executor.invoke({
            "input": agent_input,
            "chat_history": current_history
        })
        
        raw_output = response_data['output']
        final_text = ""
        card_data = None 

        # 1. Chuyển raw_output thành chuỗi (để xử lý Regex)
        if isinstance(raw_output, list):
            # Nếu là list, nối lại thành chuỗi
            raw_output_str = "".join([str(item.get('text', '')) if isinstance(item, dict) else str(item) for item in raw_output])
        elif isinstance(raw_output, dict):
            # Nếu là dict, chuyển thành string JSON để Regex xử lý đồng nhất
            raw_output_str = json.dumps(raw_output)
        else:
            raw_output_str = str(raw_output)

        # 2. Dùng Regex "gắp" khối JSON ra (Bất chấp Agent nói hươu vượn gì)
        json_match = re.search(r'\{.*\}', raw_output_str, re.DOTALL)

        if json_match:
            try:
                # Parse chuỗi tìm được thành Dict
                potential_data = json.loads(json_match.group())
            
                card_json = None
                payment_json = None

                if "product_detail_card_response" in potential_data:
                    card_json = potential_data["product_detail_card_response"]
                
                elif "create_order_tool_response" in potential_data:
                    payment_json = potential_data["create_order_tool_response"]
            
                # Kiểm tra dạng phẳng (Flat JSON)
                elif "product_name" in potential_data and "image_url" in potential_data:
                    card_json = potential_data
            
                elif "payment_url" in potential_data:
                    payment_json = potential_data

                if card_json:
                
                    final_text = card_json.get("summary_text", "Dưới đây là thông tin sản phẩm:")
                
                    # Tạo object Card
                    card_data = ProductCardData(
                        product_name=card_json.get("product_name", ""),
                        image_url=card_json.get("image_url", ""),
                        product_link=f"http://localhost:8080/Spring-mvc/Detail?p={card_json.get('product_alias')}&id_pbsp={card_json.get('id_pbsp')}",
                        id_pbsp=int(card_json.get("id_pbsp", 0))
                    )

                elif payment_json:
                    final_text = payment_json.get("message", "Vui lòng thanh toán:")
                
                    card_data = ProductCardData(
                        product_name=f"Đơn hàng #{payment_json.get('order_id')}",
                        image_url="https://stcd02206177151.cloud.edgevnpay.vn/assets/images/logo-icon/logo-primary.svg",
                        product_link=payment_json.get('payment_url'),
                        id_pbsp=0
                    )
                    print("--- [PAYMENT LINK DETECTED] ---")

            # Nếu không tìm thấy dữ liệu hợp lệ nào
                else:
                    final_text = raw_output_str

            except Exception as e:
                print(f"JSON Parse Error: {e}")
                final_text = raw_output_str
        else:
            final_text = raw_output_str

        current_history.append(HumanMessage(content=question))
        current_history.append(AIMessage(content=final_text))
        
        # Giới hạn lịch sử (giữ 10 tin nhắn cuối để tiết kiệm token)
        if len(current_history) > 20:
            current_history = current_history[-20:]
        chat_history_memory[session_id] = current_history

        # 5. Trả về kết quả JSON cho Frontend
        return ChatResponse(
            text=final_text,
            card=card_data
        )

    except Exception as e:
        print(f"❌ Lỗi xử lý: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    # Chạy server tại localhost:8000
    uvicorn.run(app, host="0.0.0.0", port=8000)