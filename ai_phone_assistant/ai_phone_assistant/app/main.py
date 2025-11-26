import os
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
        
        # 3. Xử lý kết quả trả về (Logic y hệt hàm main cũ)
        raw_output = response_data['output']
        
        final_text = ""
        card_data = None # Mặc định không có card

        if isinstance(raw_output, dict):
            data = raw_output
        elif isinstance(raw_output, str):
            try:
                data = json.loads(raw_output)  # parse string → dict
            except:
                data = None  # không phải JSON → để xử lý text thuần
        else:
            data = None

        if isinstance(data, dict) and "product_detail_card_response" in data:
            card_json = data["product_detail_card_response"]

            final_text = card_json.get("summary_text", "")

            card_data = ProductCardData(
                product_name=card_json.get("product_name", ""),
                image_url=card_json.get("image_url", ""),
                product_link=f"http://localhost:8080/Spring-mvc/Detail?p={card_json.get('product_alias')}&id_pbsp={card_json.get('id_pbsp')}",
                id_pbsp=int(card_json.get("id_pbsp", 0))
            )
        else:
            if isinstance(raw_output, str):
                final_text = raw_output
            elif isinstance(raw_output, list):
                text_parts = []
                for part in raw_output:
                    if isinstance(part, dict) and "text" in part:
                        text_parts.append(part["text"])
                    elif isinstance(part, str):
                        text_parts.append(part)
                final_text = "".join(text_parts)
            else:
                final_text = str(raw_output)

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