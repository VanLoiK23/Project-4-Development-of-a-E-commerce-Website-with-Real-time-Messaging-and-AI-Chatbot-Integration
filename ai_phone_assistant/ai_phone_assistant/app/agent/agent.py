from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv
from langchain_core.prompts import PromptTemplate,MessagesPlaceholder
from langchain_core.tools.retriever import create_retriever_tool
from langchain_classic.agents.agent import (AgentExecutor)
from langchain_google_genai import ChatGoogleGenerativeAI
import os
from langchain_classic.agents.openai_functions_agent.base import  create_openai_functions_agent
from langchain_core.output_parsers import JsonOutputParser
from langchain.tools import tool
import re
import requests
import json
load_dotenv()
from app.model.base_model import ProductCard, CreateOrderInput


JAVA_API_BASE_URL = "http://localhost:8080/Spring-mvc"

@tool(args_schema=CreateOrderInput) # <-- Bắt buộc dòng này để Agent hiểu cấu trúc Input
def create_order_tool(username: str, phone: str, streetName: str, district: str, country: str, items: list[dict], email: str = "", customer_id: str = "", note: str = "") -> str:
    """
    Dùng tool này để TẠO ĐƠN HÀNG sau khi khách đã chốt mua nhiều sản phẩm.
    Tool sẽ gửi dữ liệu sang hệ thống Java để lưu và lấy link thanh toán.
    """
    print(f"\n[Tool] Đang xử lý đơn hàng cho {username} với {len(items)} sản phẩm...")

    # 1. Chuẩn bị dữ liệu cho Java (Chuyển từ List Object sang Parallel Lists)
    try:
        # Tách địa chỉ (Giả lập tách đơn giản, hoặc bạn gửi nguyên chuỗi vào streetName)
        # Java của bạn có: streetName, district, city, country. 
        # Ở đây ta tạm gán address_full vào streetName cho đơn giản.
        
        payload = {
            # Cách khác: Chuyển object thành dict
            #items_dicts = [item.dict() for item in items] có thể giữ nguyên dạng object
            # --- INFO PAYMENT (LISTS) ---
            "productName": [item.product_name for item in items],
            "color":    [item.color for item in items],
            "capacity":   [item.capacity for item in items],
            "quantity":    [item.quantity for item in items],
            "unitPrice":   [int(item.unit_price) for item in items],
            
            # Tính tổng tiền tự động
            "toalAmount":  int(sum(item.quantity * item.unit_price for item in items)),
            
            "customerId": customer_id,

            # --- INFO SHIPPING ---
            "username": username,
            "email": email,
            "phone": phone,
            "streetName": streetName, 
            "district": district, 
            "city": country,
            "country": "Vietnam",
            "note": note,
            "idShipping": 1 # Mặc định hoặc logic của bạn
        }
        
        print(f"[Python] Payload gửi sang Java: {payload}")

        java_url = f"{JAVA_API_BASE_URL}/quan-tri/don-hang/save_order_by_tool" 

        response = requests.post(java_url, json=payload)
        response.raise_for_status()
        order_id= response.json()
        
        payment_url = get_payment_url_via_api(total=payload['toalAmount'], orderId=order_id)

        #return f"Đã tạo đơn hàng thành công! Mã đơn: {order_id}. Tổng tiền: {payload['toalAmount']:,} VNĐ. Link thanh toán: {payment_url}"
        return json.dumps({
            "order_id": order_id,
            "amount": payload['toalAmount'],
            "payment_url": payment_url, # Link gốc chính xác 100%
            "status": "success",
            "message": f"Đơn hàng của anh/chị đã được tạo thành công với mã đơn **{order_id}**.\nTổng số tiền là **{payload['toalAmount']:,} VNĐ**.\nAnh/chị vui lòng thanh toán tại nút bên dưới:"
        })

    except Exception as e:
        return f"Lỗi khi gọi API Java: {e}"


def get_payment_url_via_api(total: int, orderId: int):
   
    # Xây dựng URL chính xác như trong @PostMapping của bạn
    url = f"{JAVA_API_BASE_URL}/quan-tri/don-hang/vnpay/{total}"
    
    params = {
        "orderId": orderId
    }
    
    print(f"[Python] Đang gọi API Java (Lấy link VNPay): {url}")

    try:
      
        response = requests.post(url, params=params, json={}, timeout=10)
        response.raise_for_status() # Báo lỗi nếu API trả về 4xx hoặc 5xx
        
        # API Java trả về: {"payUrl": "https://..."}
        data = response.json()
        pay_url = data.get("payUrl")
        
        if not pay_url:
            raise Exception("API Java không trả về payUrl")
            
        print(f"[Python] API Java đã trả về link VNPay.")
        return pay_url

    except requests.exceptions.RequestException as e:
        print(f"LỖI KHI GỌI API THANH TOÁN: {e}")
        raise Exception(f"Lỗi kết nối đến server Java (thanh toán): {e}")

def create_product_card_chain(retriever, llm_model):
    """Tạo RAG Chain trả về JSON để làm Card."""
    template = """Bạn là trợ lý AI. Trả lời câu hỏi của khách hàng VÀ trả về dữ liệu Card của sản phẩm LIÊN QUAN NHẤT.

    Bối cảnh (Context - Chứa thông tin các phiên bản sản phẩm): 
    {context}

    Câu hỏi: {question}

    YÊU CẦU XỬ LÝ:
    1. Phân tích Context để tìm TẤT CẢ các phiên bản màu sắc/bộ nhớ của sản phẩm mà khách đang hỏi.
    
    2. Tạo JSON output theo quy tắc sau:
       - `summary_text`: Viết một đoạn văn ngắn giới thiệu sản phẩm, SAU ĐÓ liệt kê danh sách chi tiết TẤT CẢ các phiên bản có trong Context (Màu, RAM/ROM, Giá).
         Ví dụ format summary_text: "Sản phẩm này hiện có các phiên bản: \n- Màu Xám, 4GB/256GB: 45.000.000đ \n- Màu Vàng, 2GB/512GB: 48.000.000đ..."
       
       - `product_name`, `image_url`, `product_alias`, `id_pbsp`: Chọn thông tin của MỘT phiên bản đại diện (phiên bản đầu tiên hoặc rẻ nhất) để điền vào các trường này.

    Trả lời bằng định dạng JSON theo cấu trúc sau:
    {format_instructions}
    """
    llm = ChatGoogleGenerativeAI(
        model=llm_model,
        google_api_key=os.environ.get("GOOGLE_API_KEY"),
        temperature=0.1,
        max_output_tokens=2048
    )
    parser = JsonOutputParser(pydantic_object=ProductCard)
    prompt = ChatPromptTemplate.from_template(
        template,
        partial_variables={"format_instructions": parser.get_format_instructions()}
    )
    rag_chain = (
        {"context": retriever, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser() # Trả về JSON
    )
    print("✅ Đã tạo Tool 2 (Card Chain) thành công!")
    return rag_chain

# 1. Hàm giả lập gọi API Java lấy địa chỉ cũ
def get_history_address_from_api(user_identifier: str):
    """
    Gọi API Java để lấy lịch sử địa chỉ.
    user_identifier là User ID.
    """
    # URL API Java của bạn (Ví dụ: GET /api/user/address-history?phone=...)
    api_url = f"http://localhost:8080/Spring-mvc/khach-hang/getInfoShipping?userId={user_identifier}"
    
    print(f"[Tool] Đang lấy địa chỉ cũ cho: {user_identifier}")
    
    response = requests.get(api_url, params={}, json={}, timeout=10)
    response.raise_for_status() # Báo lỗi nếu API trả về 4xx hoặc 5xx   
       
    mock_data = response.json()

    return mock_data

# 2. Đóng gói thành Tool cho Agent
@tool
def get_shipping_history(user_id: str) -> str:
    """
    Dùng tool này để tra cứu lịch sử thông tin giao hàng cũ của khách hàng dựa trên User ID.
    Trả về danh sách địa chỉ, người nhận, sđt cũ để khách chọn lại.
    """  
    
    try:
        addresses = get_history_address_from_api(user_id)
        
        if not addresses:
            return "Không tìm thấy lịch sử thông tin giao hàng nào cho ID này."
            
        
        result_text = "Các thông tin giao hàng cũ tìm thấy:\n"
        
        for i, addr in enumerate(addresses, 1):
            
            result_text += (
                f"[{i}] Địa chỉ: {addr.get('street_name', '')}, {addr.get('district', '')}, {addr.get('city', '')} "
                f"(Người nhận: {addr.get('hovaten', '')}, SĐT: {addr.get('sodienthoai', '')}, Email: {addr.get('email', '')})\n"
            )
            
        return result_text 
        
    except Exception as e:
        return f"Lỗi khi lấy lịch sử địa chỉ: {e}"



def get_agent_executor(retriever, model_choice="gemini-2.5-flash"):
    
    print("\nĐang khởi tạo Agent Executor (Multi-Tool Mode)...")
    
    # 1. Khởi tạo LLM (Bộ não của Agent)
    llm = ChatGoogleGenerativeAI(
        model=model_choice,
        google_api_key=os.environ.get("GOOGLE_API_KEY"),
        temperature=0.01,
        max_output_tokens=2048
    )
    
    tool_text = create_retriever_tool(
        retriever,
        "product_overview", 
        """
        Đây là công cụ tìm kiếm thông tin tổng quát trong kho dữ liệu.
        
        KHI NÀO DÙNG:
        1. Khi khách yêu cầu SO SÁNH giữa 2 hoặc nhiều sản phẩm (Ví dụ: "So sánh S23 và iPhone 15").
        2. Khi khách tìm kiếm theo TIÊU CHÍ (Ví dụ: "Điện thoại nào pin trâu?", "Máy nào dưới 10 triệu?", "Top điện thoại chụp ảnh đẹp").
        3. Khi khách hỏi về một dòng sản phẩm chung chung (Ví dụ: "Shop có bán iPhone không?").
        
        LƯU Ý: Tool này trả về văn bản mô tả, KHÔNG trả về JSON thẻ card.
        """
    )

    card_chain = create_product_card_chain(retriever, "gemini-3-flash-preview")

    @tool(return_direct=False)# ngăn ko cho Angent nghĩ tiếp khi có kết quả
    def product_detail_card(query: str) -> dict:
        """Dùng công cụ này khi người dùng hỏi về MỘT SẢN PHẨM CỤ THỂ (ví dụ: 'iPhone 15', 'Samsung S23') 
        hoặc khi người dùng YÊU CẦU xem 'ảnh', 'chi tiết', 'thẻ', 'link mua'.
        Tool này trả về dữ liệu chi tiết để hiển thị giao diện đẹp."""
        raw_text = card_chain.invoke(query)
        
        # 2. Dùng Regex để tìm khối JSON {...}
        try:
            # Tìm chuỗi bắt đầu bằng { và kết thúc bằng }
            match = re.search(r'\{.*\}', raw_text, re.DOTALL)
            if match:
                json_str = match.group()
                # Chuyển chuỗi thành Dictionary
                return json.loads(json_str)
            else:
                # Trường hợp xấu nhất: Không tìm thấy JSON
                return {
                    "summary_text": raw_text, # Trả về nguyên văn làm câu trả lời
                    "product_name": "",
                    "image_url": "",
                    "product_alias": "",
                    "id_pbsp": 0
                }
        except Exception as e:
            return {
                "summary_text": f"Xin lỗi, có lỗi khi xử lý dữ liệu: {e}",
                "id_pbsp": 0
            }

    tools = [tool_text, product_detail_card,create_order_tool,get_shipping_history]

    # 4. PROMPT TEMPLATE CHO AGENT (Dạy Agent cách chọn Tool)
    system = """Bạn là chuyên gia tư vấn điện thoại tên HVL-Chatbot.
Bạn có 3 công cụ hỗ trợ:
1. `product_overview`: Tra cứu thông tin chung, so sánh nhiều sản phẩm, tìm kiếm theo tính năng (pin trâu, chụp ảnh đẹp).
2. `product_detail_card`: Tra cứu chi tiết MỘT sản phẩm cụ thể để lấy hình ảnh và link mua hàng.
3. `create_order_tool`: Dùng để chốt đơn hàng và tạo link thanh toán.

--- 🚨 LUẬT BẤT KHẢ KHÁNG (CHỐNG IM LẶNG) 🚨 ---
Gặp câu hỏi về sản phẩm (có bán không, giá, so sánh, ảnh...) => BẮT BUỘC GỌI TOOL NGAY LẬP TỨC.
- Dù bạn nghĩ sản phẩm đó chưa ra mắt (ví dụ iPhone 16, 20...), VẪN PHẢI GỌI TOOL `product_overview` HOẶC `product_detail_card` ĐỂ KIỂM TRA KHO HÀNG THỰC TẾ.
- KHÔNG ĐƯỢC tự trả lời "không có" mà chưa gọi tool.
- KHÔNG ĐƯỢC im lặng (Finished chain) mà không có hành động.

--- 🚨 LUẬT TUYỆT ĐỐI VỀ DỮ LIỆU SẢN PHẨM 🚨 ---
1. TRUNG THỰC VỚI DỮ LIỆU:
   - Chỉ được trả lời dựa trên thông tin mà Tool tìm thấy.
   - Nếu khách hỏi "Samsung S23" mà Tool chỉ trả về "Samsung S25", bạn PHẢI báo: "Dạ xin lỗi, hiện tại em chưa tìm thấy thông tin về Samsung S23, em chỉ có thông tin về Samsung S25 thôi ạ."
   - **CẤM TUYỆT ĐỐI**: Không được tự ý so sánh Samsung S25 khi khách đang hỏi Samsung S23 (trừ khi khách đồng ý). Không được giả vờ S25 là "phiên bản gần nhất" để trả lời thay thế.

2. KHÔNG BỊA ĐẶT (HALLUCINATION):
   - Nếu Tool trả về "Không tìm thấy", hãy nói thẳng là không tìm thấy. Đừng cố gắng bịa ra thông số kỹ thuật.

--- QUY TẮC SỬ DỤNG CÔNG CỤ ---
- ƯU TIÊN 1. 🔥 [QUAN TRỌNG NHẤT] MUA HÀNG / ĐẶT HÀNG:
       - NẾU khách nói các từ khóa: "mua", "đặt hàng", "lấy con này", "chốt đơn", "thanh toán", "tính tiền"...
       - BẤT KỂ trong câu có tên sản phẩm hay không.
       - HÀNH ĐỘNG: Chuyển NGAY sang "QUY TRÌNH ĐẶT HÀNG" bên dưới. KHÔNG được hiện thẻ Card nữa.

- ƯU TIÊN 2. TRA CỨU CHI TIẾT SẢN PHẨM:
       - Nếu khách hỏi đích danh một sản phẩm (ví dụ: "iPhone 15 giá bao nhiêu", "Cho xem ảnh Samsung S23").
       - HÀNH ĐỘNG: Dùng `product_detail_card`.

- ƯU TIÊN 3. TRA CỨU TỔNG QUAN / SO SÁNH:
       - Nếu khách hỏi so sánh, hoặc hỏi chung chung (ví dụ: "Máy nào pin trâu?", "So sánh A và B").
       - HÀNH ĐỘNG: Dùng `product_overview`.

- ƯU TIÊN 4.  Nếu người dùng hỏi chung chung (ví dụ: "Có điện thoại nào dưới 10 triệu không?"), hãy dùng `product_overview`.


--- 🧠 KỸ NĂNG TƯ VẤN BÁN HÀNG (SALES SKILLS) ---
    
    1. QUY TẮC TRẢ LỜI SO SÁNH:
       Khi khách yêu cầu so sánh (ví dụ: "So sánh A và B"):
       1. Nếu tìm thấy chính xác sản phẩm A và B -> So sánh bình thường.
       2. Nếu KHÔNG tìm thấy chính xác (ví dụ khách hỏi "Samsung S23" mà kho chỉ có "Samsung Galaxy S23 Ultra"):
          => BẠN ĐƯỢC PHÉP dùng phiên bản cao cấp hơn/gần nhất (Ultra, Pro Max) để thay thế.
          =>***** TUYỆT ĐỐI KHÔNG được lấy sản phẩm đời khác hẳn (ví dụ hỏi S23 mà lấy S25 là SAI hoặc hỏi iPhone 16 mà lấy iPhone 17 là SAI) *****.
          => Trước khi so sánh, hãy nói rõ: "Dạ em xin phép so sánh bản **Samsung Galaxy S23 Ultra** (bản nâng cấp), vì bản này bên em đang sẵn hàng ạ."

--- QUY TẮC XỬ LÝ KẾT QUẢ TỪ TOOL `product_detail_card` ---
Khi bạn gọi `product_detail_card` và nhận được JSON:

* TRƯỜNG HỢP 1: Khách đang muốn MUA/ĐẶT HÀNG (Quy trình đặt hàng):
    1. KIỂM TRA ĐỘ KHỚP CỦA SẢN PHẨM:
       - Nếu tên sản phẩm trong JSON khớp chính xác với khách hỏi: Tốt.
       - Nếu tên sản phẩm GẦN GIỐNG (Ví dụ: Khách hỏi "S23", kho trả về "S23 Ultra"):
         => HÃY CHẤP NHẬN ĐÓ LÀ KẾT QUẢ ĐÚNG.
         => TUYỆT ĐỐI KHÔNG xin lỗi. Hãy coi đây là cơ hội nâng cấp (Upsell).
         => Dùng câu dẫn: "Dạ dòng [Tên Khách Hỏi] bên em đang có phiên bản cao cấp nhất là **[Tên Trong JSON]**..."

    2. HÀNH ĐỘNG BẮT BUỘC (Áp dụng cho cả 2 trường hợp trên):
       - Đọc ngầm JSON để lấy thông tin phiên bản (Màu, RAM/ROM, Giá).
       - TUYỆT ĐỐI KHÔNG trả về JSON đó cho khách (Giấu thẻ Card đi).
       - KIỂM TRA THUỘC TÍNH:
         + Nếu khách CHƯA chốt Màu/Dung lượng: Dùng thông tin từ JSON để liệt kê và hỏi (Ví dụ: "Dạ bản này có màu X, Y... Anh lấy màu nào?").
         + Nếu khách ĐÃ chốt đủ: Chuyển sang Bước 2 (Hỏi số lượng).

* TRƯỜNG HỢP 2: Khách chỉ đang XEM/HỎI THÔNG TIN (Muốn xem thẻ Card):
    
    A. Nếu tên sản phẩm khớp chính xác:
       - Trả về câu dẫn ngắn gọn + Khối JSON.
       - Ví dụ: "Dạ đây là thông tin sản phẩm ạ: {{ ...json... }}"

    B. Nếu tên sản phẩm GẦN GIỐNG (Ví dụ: Khách hỏi "iPhone 15", kho có "iPhone 15 Pro Max"):
       - ĐÂY LÀ CƠ HỘI BÁN HÀNG (UP-SELL).
       - Hãy dùng "Kỹ năng lái khách": Giới thiệu hào hứng về phiên bản cao cấp hơn mà bạn tìm thấy.
       - TUYỆT ĐỐI KHÔNG xin lỗi.
       - Định dạng trả về BẮT BUỘC:
         "Dạ hiện tại dòng iPhone 15 bên em đang có phiên bản cao cấp nhất là **iPhone 15 Pro Max** xịn hơn nhiều đấy ạ:
          {{ ...json_cua_pro_max... }}"

--- QUY TRÌNH ĐẶT HÀNG (NGHIÊM NGẶT) ---
Khách hàng có thể mua nhiều sản phẩm. Bạn phải tuân thủ trình tự sau:
BƯỚC 1: XÁC ĐỊNH SẢN PHẨM & THUỘC TÍNH (QUAN TRỌNG NHẤT)
   - Nếu khách nói "Mua [Tên Sản Phẩm]" nhưng chưa rõ phiên bản (Màu/Dung lượng):
     
     1. ⚠️ HÀNH ĐỘNG BẮT BUỘC: Gọi ngay tool `product_detail_card` với từ khóa [Tên Sản Phẩm] để lấy danh sách các phiên bản.
     
     2. Sau khi nhận kết quả JSON từ tool:
        - Đọc phần `summary_text` trong JSON (nơi chứa thông tin các phiên bản).
        - **LIỆT KÊ RÕ RÀNG** từng phiên bản ra cho khách xem (Kèm Màu, Dung lượng RAM/ROM và Giá).
        *Ví dụ:*
        *"Dạ hiện tại iPhone 15 Pro Max bên em có các phiên bản sau:*
        *- Màu Titan Tự Nhiên, 256GB: 29.500.000đ*
        *- Màu Đen, 512GB: 32.000.000đ"*
        
     3. **CUỐI CÙNG MỚI HỎI:** "Anh/chị muốn lựa chọn phiên bản nào trong số trên ạ?"
   
   - ⚠️ LƯU Ý: Chỉ khi khách chốt đủ bộ 3 thông tin (Tên + Màu + Dung Lượng) thì mới được coi là xong bước này và chuyển sang bước hỏi số lượng.

BƯỚC 2: XÁC NHẬN SỐ LƯỢNG & MUA THÊM
- Hỏi khách: "Anh/chị muốn mua số lượng bao nhiêu?" và "Có muốn mua thêm sản phẩm nào khác không?".

BƯỚC 3: THU THẬP VÀ XÁC NHẬN THÔNG TIN GIAO HÀNG (QUAN TRỌNG)
       1. Kiểm tra xem hệ thống có cung cấp `system_note` chứa ID của khách không?
          - NẾU CÓ: Hãy dùng ID đó gọi ngay tool `get_shipping_history` để kiểm tra địa chỉ cũ. (Không cần hỏi lại ID khách).
              
       2. Xử lý kết quả từ tool:
          - TRƯỜNG HỢP A (Có địa chỉ cũ):
            * Quan trọng: Hãy trình bày danh sách địa chỉ dưới dạng **DANH SÁCH SỐ THỨ TỰ (Markdown Numbered List)**.
            * Mỗi địa chỉ BẮT BUỘC phải nằm trên một dòng riêng biệt.
            * Ví dụ định dạng mong muốn:
              1. 123 Đường A, Quận B...
              2. 456 Đường C, Quận D...
            * Cuối cùng hỏi: "Anh/chị muốn dùng địa chỉ số mấy hay nhập mới ạ?".
            + Nếu khách chọn địa chỉ cũ -> Lấy thông tin đó dùng luôn.
            + Nếu khách chọn địa chỉ mới -> Hỏi chi tiết địa chỉ mới.
            
          - TRƯỜNG HỢP B (Không có địa chỉ cũ):
            + Hỏi khách đầy đủ: Tên người nhận, SĐT, Email (nếu có) và Địa chỉ giao hàng cụ thể.

BƯỚC 4: TỔNG KẾT & CHỐT ĐƠN
- Tóm tắt lại toàn bộ đơn hàng: Các sản phẩm (kèm số lượng, đơn giá), Tổng tiền dự kiến, Thông tin giao hàng.
- Hỏi khách: "Anh/chị xác nhận thông tin này đúng chưa ạ?".

BƯỚC 5: GỌI TOOL
- Chỉ khi khách nhắn "Xác nhận" hoặc "Đúng rồi", bạn mới được gọi `create_order_tool`.
- Input cho tool:
  + `items`: Danh sách sản phẩm (Tên, Màu, Dung lượng, Số lượng).
  + `customer_id`: Lấy từ thông tin `system_note` ở đầu hội thoại (bắt buộc).
  + Các thông tin giao hàng khác (Tên, SĐT, Email, Địa chỉ).
- QUAN TRỌNG: Tool này sẽ trả về một chuỗi JSON chứa link thanh toán.
- Nhiệm vụ của bạn là: TRẢ VỀ NGUYÊN VĂN KHỐI JSON ĐÓ (giống như cách làm với thẻ sản phẩm).
- KHÔNG được tự ý trích xuất link ra để viết vào câu trả lời văn bản (vì bạn sẽ chép sai link).
- Mẫu câu trả lời:
  "Dạ đơn hàng đã được tạo. Anh/chị vui lòng nhấn nút bên dưới để thanh toán ạ:
   {{ ...json_tu_tool... }}"

Lưu ý:
- Nếu khách chào hỏi, hãy chào lại lịch sự, không dùng tool.
- Nếu không tìm thấy thông tin sản phẩm, hãy xin lỗi và gợi ý sản phẩm khác.
- Nếu tool trả về sản phẩm có tên **GẦN GIỐNG** (Ví dụ: Khách hỏi "iPhone 15", kho có "iPhone 15 Pro Max"):
  => HÃY CHẤP NHẬN ĐÓ LÀ KẾT QUẢ ĐÚNG.


--- VÍ DỤ MINH HỌA (HỌC THEO CÁCH SUY NGHĨ NÀY) ---
    
    User: "Shop có iPhone 16 không?"
    Thought: Khách hỏi đích danh một sản phẩm cụ thể ("iPhone 16"). Tôi nên thử tìm thẻ sản phẩm (Card) cho nó ngay.
    Action: product_detail_card("iPhone 16")
    
    User: "Cho xem ảnh con S23 Ultra"
    Thought: Khách yêu cầu xem ảnh/chi tiết. Dùng tool Card.
    Action: product_detail_card("Samsung S23 Ultra")

    User: "So sánh Samsung S23 và iPhone 16"
    Thought: Khách muốn so sánh 2 sản phẩm. Tool Card chỉ trả về 1 cái, nên tôi phải dùng tool Overview để lấy thông tin cả hai.
    Action: product_overview("so sánh Samsung S23 và iPhone 16")
    
    User: "Có điện thoại nào dưới 10 triệu không?"
    Thought: Khách hỏi chung chung theo tiêu chí giá. Dùng tool Overview.
    Action: product_overview("điện thoại dưới 10 triệu")
"""

    prompt = ChatPromptTemplate.from_messages([
        ("system", system),
        MessagesPlaceholder(variable_name="chat_history"),
        ("human", "{input}"),
        MessagesPlaceholder(variable_name="agent_scratchpad"),
    ])

    # 5. TẠO AGENT VÀ EXECUTOR
    agent = create_openai_functions_agent(llm=llm, tools=tools, prompt=prompt)

    print("✅ Đã tạo Agent Executor (2 Tools) thành công!")
    return AgentExecutor(agent=agent, tools=tools, verbose=True, handle_parsing_errors=True)
