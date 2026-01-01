from ast import List
import mysql.connector # Import thư viện MySQL
from mysql.connector import Error # Để bắt lỗi
from langchain_core.documents import Document
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
from langchain_community.embeddings import HuggingFaceEmbeddings 
from langchain_chroma import Chroma
from langchain_community.chat_models import ChatOllama
from langchain_community.retrievers import BM25Retriever
from langchain_classic.retrievers import EnsembleRetriever
from langchain_core.prompts import PromptTemplate,MessagesPlaceholder
from langchain_core.tools.retriever import create_retriever_tool
from langchain_classic.agents.tool_calling_agent.base import create_tool_calling_agent
from langchain_classic.agents.agent import (AgentExecutor)
from langchain_classic.agents.react.agent import create_react_agent
from langchain_core.tools.render import render_text_description
from langchain_google_genai import ChatGoogleGenerativeAI
import os
from langchain_classic.agents.openai_functions_agent.base import  create_openai_functions_agent
from langchain_core.messages.human import HumanMessage
from langchain_core.messages import AIMessage
from pydantic import Tag
from pydantic import BaseModel, Field
from langchain_core.output_parsers import JsonOutputParser
from langchain.tools import tool
import re
import requests
import json
load_dotenv()

def load_products_from_sql(
    db_host="127.0.0.1", 
    db_user="python_user",
    db_password="123456",
    db_name="quanlibanhang",
    port= 3306
):
   
    print(f"Đang kết nối tới MySQL DB: {db_name} tại {db_host}")
    
    products_data = []
    conn = None # initial connection variable
    
    try:
        # connect to MySQL
        conn = mysql.connector.connect(
            host=db_host,
            user=db_user,
            password=db_password,
            database=db_name
        )
        
        if conn.is_connected():
            print("Connect success!")
            
            # dictionary=True giúp trả về kết quả dạng dictionary 
            cursor = conn.cursor(dictionary=True) 
            
            cursor.execute("""
    SELECT 
    -- general information
    sp.masp,
    sp.tensp,
    sp.alias,
    sp.hinhanh,
    sp.dungluongpin,
    sp.manhinh,
    hedieuhanh.tenhedieuhanh,
    sp.camerasau,
    sp.cameratruoc,
    sp.phienbanhdh,
    thuonghieu.tenthuonghieu,
    sp.sortDesc,
    sp.detail,
    -- detail information
    ram.kichthuocram,
    rom.kichthuocrom,
    color.tenmausac,
    pb.maphienbansp,
    pb.giaxuat,
    pb.price_sale,
    pb.soluongton,
    pb.sale FROM `sanpham`  as sp
    LEFT JOIN `phienbansanpham` as pb ON sp.masp = pb.masp
    LEFT JOIN `dungluongram` as ram ON pb.ram = ram.madungluongram
    LEFT JOIN `dungluongrom` as rom ON pb.rom = rom.madungluongrom
    LEFT JOIN `mausac` as color ON pb.mausac = color.mamausac
    LEFT JOIN `thuonghieu` ON sp.thuonghieu = thuonghieu.mathuonghieu
    LEFT JOIN `hedieuhanh` ON sp.hedieuhanh = hedieuhanh.mahedieuhanh
    WHERE sp.status = 1 AND pb.soluongton > 0
            """)
            
            products_data = cursor.fetchall() 
            print(f"Đã tải thành công {len(products_data)} sản phẩm từ MySQL.")

    except Error as e:
        print(f"Lỗi khi kết nối hoặc truy vấn MySQL: {e._full_msg}")
        return [] # Trả về list rỗng nếu lỗi

    finally:
        # Đảm bảo luôn đóng kết nối dù thành công hay thất bại
        if conn and conn.is_connected():
            cursor.close()
            conn.close()
            print("Đã đóng kết nối MySQL.")
            
    return products_data # Trả về list các dictionary



def format_products_to_documents(products_data):
    """
    Tạo một Document cho MỖI PHIÊN BẢN SẢN PHẨM 
    từ dữ liệu đã JOIN của SQL.
    """
    print("Đang định dạng dữ liệu đã JOIN thành các Document...")
    documents = []
    
    for product in products_data:

        # --- BẮT ĐẦU PHẦN CODE MỚI (TẠO TAGS) ---
        tags = []
        try:
            # Tạo tag cho Pin
            pin_value = int(product.get('dungluongpin', 0))
            if pin_value >= 5000:
                tags.append("pin trâu")
                tags.append("pin 5000mAh trở lên")
                tags.append("thời lượng pin dài")
            elif pin_value >= 4500:
                tags.append("pin tốt")
                tags.append("pin 4500mAh")
                
            # Tạo tag cho Giá
            gia_value = int(product.get('price_sale', 0))
            if gia_value <= 5000000:
                tags.append("giá rẻ")
                tags.append("dưới 5 triệu")
            elif gia_value <= 10000000:
                tags.append("phân khúc phổ thông")
                tags.append("khoảng 5-10 triệu")
                tags.append("tầm trung")
            elif gia_value <= 15000000:
                tags.append("tầm trung")
                tags.append("khoảng 10-15 triệu")
            elif gia_value >= 20000000:
                tags.append("cao cấp")
                tags.append("flagship")
                tags.append("trên 20 triệu")

            ram_value = 0
            try:
               ram_str = (product.get('kichthuocram') or "").lower().replace("gb", "").strip()
               ram_value = int(ram_str)
            except: pass

            if ram_value >= 12:
               tags.append("RAM 12GB trở lên")
               tags.append("đa nhiệm tốt")
               tags.append("chơi game")
               tags.append("cấu hình mạnh")
            elif ram_value >= 8:
               tags.append("RAM 8GB")
               tags.append("đa nhiệm tốt")
            elif ram_value >= 6:
               tags.append("RAM 6GB")
        
   
            rom_value = 0
            try:
               rom_str = (product.get('kichthuocrom') or "").lower().replace("gb", "").strip()
               rom_value = int(rom_str)
            except: pass
    
            if rom_value >= 512:
               tags.append("bộ nhớ 512GB trở lên")
               tags.append("bộ nhớ lớn")
               tags.append("lưu trữ thoải mái")
            elif rom_value >= 256:
               tags.append("bộ nhớ 256GB")
               tags.append("lưu trữ thoải mái")
            elif rom_value >= 128:
               tags.append("bộ nhớ 128GB")

            # === 5. Tạo tag cho Camera (Chụp ảnh đẹp) ===
            camera_value = 0
            try:
               cam_str = (product.get('camerasau') or "").lower().split(" ")[0] # Lấy số đầu tiên
               cam_value = int(cam_str.replace("mp", "").strip())
            except: pass
    
            if camera_value >= 108:
               tags.append("chụp ảnh đẹp")
               tags.append("camera 108MP")
               tags.append("camera khủng")
            elif camera_value >= 50:
               tags.append("chụp ảnh đẹp")
               tags.append("camera 50MP")
            elif camera_value >= 12:
               tags.append("chụp ảnh tốt")
        
            # === 6. Tạo tag cho Màn hình (Xem phim) ===
            screen_info = (product.get('manhinh') or "").lower()
            if "oled" in screen_info or "amoled" in screen_info:
               tags.append("màn hình OLED")
               tags.append("màn hình đẹp")
               tags.append("xem phim")
            if "120hz" in screen_info:
               tags.append("màn hình 120Hz")
               tags.append("màn hình mượt")
               tags.append("chơi game")

           # === 7. Tạo tag cho Thương hiệu và Hệ điều hành ===
            brand = (product.get('tenthuonghieu') or "").lower()
            if "apple" in brand:
               tags.append("iPhone")
               tags.append("iOS")
            elif "samsung" in brand:
               tags.append("Samsung")
               tags.append("Android")
            elif "xiaomi" in brand:
               tags.append("Xiaomi")
               tags.append("Android")
            elif "oppo" in brand:
               tags.append("Oppo")
               tags.append("Android")

           # === 8. Tạo tag cho Khuyến mãi ===
            sale_value = 0.0
            try:
               sale_value = float(product.get('sale', 0.0))
            except: pass
    
            if sale_value > 0:
               tags.append("đang giảm giá")
               tags.append("đang khuyến mãi")
            if sale_value >= 20:
               tags.append("giảm giá sâu")
               tags.append("giảm giá sốc")
            
        except Exception as e:
            print(f"Lỗi khi tạo tag cho sản phẩm {product.get('tensp')}: {e}")
            
        # Biến danh sách tags thành một chuỗi
        # Dùng set() để loại bỏ các tag bị trùng lặp (ví dụ: "chơi game" xuất hiện 2 lần)
        tag_string = ", ".join(list(set(tags)))

        # Content AI handle
        content = f"""
[THÔNG TIN TƯ VẤN SẢN PHẨM]

Tên Sản Phẩm: {product.get('tensp')}
Thương Hiệu: {product.get('tenthuonghieu')}
Phiên Bản: {product.get('kichthuocram')} RAM / {product.get('kichthuocrom')} ROM
Màu Sắc: {product.get('tenmausac')}
Xuất xứ: {product.get('tenxuatxu')}
alias: {product.get('alias')}
Mô Tả Ngắn: {product.get('sortDesc')}
ảnh: {product.get('hinhanh')}
  
Giá Bán: {product.get('giaxuat')} VNĐ
Giá Giảm (Sale): {product.get('price_sale')} VNĐ
Khuyến Mãi (%): {product.get('sale')}%
Tồn Kho: {product.get('soluongton')} chiếc

Thông số Kỹ thuật Chi tiết:
- Màn hình: {product.get('manhinh')}
- Pin: {product.get('dungluongpin')} mAh
- Camera sau: {product.get('camerasau')}
- Camera trước: {product.get('cameratruoc')}
- Hệ điều hành: {product.get('tenhedieuhanh')} {product.get('phienbanhdh')}

Thẻ tìm kiếm (Keywords): {tag_string}
---------------------------------------------------
"""
        first_image = (product.get('hinhanh') or "").split(',')[0].strip()

        # Metadata 
        metadata = {
            "ma_san_pham": product.get('masp'),
            "product_name": product.get('tensp'),
            "id_pbsp": product.get('maphienbansp'),
            "image_url": first_image,
            "product_alias": product.get('alias'),
            "ten_day_du": f"{product.get('tensp')} {product.get('tenmausac')}",
            "gia_hien_tai": product.get('price_sale'),
            "ram_gb": product.get('kichthuocram'),
            "rom_gb": product.get('kichthuocrom'),
            "mau_sac": product.get('tenmausac')
        }
        
        # Create Document 
        doc = Document(page_content=content, metadata=metadata)

        documents.append(doc)
        
    print(f"✅ Đã tạo {len(documents)} Document phiên bản sản phẩm.")
    return documents


def create_vector_store(documents, persist_directory="db/chroma_sql_store"):
   
    print("Đang tạo embeddings và lưu vào ChromaDB...")
    
    # embedding model selection
    embedding_model = HuggingFaceEmbeddings(
        model_name="all-MiniLM-L6-v2",
        model_kwargs={'device': 'cpu'}
    )
    
    vectorstore = Chroma.from_documents(
        documents=documents,
        embedding=embedding_model,
        persist_directory=persist_directory,
        collection_metadata={"hnsw:space": "cosine"}  
    )
    
    print(f"Đã lưu Vector Store vào {persist_directory}")
    return vectorstore

def run_ingestion_pipeline():
    products_data = load_products_from_sql() 
    documents = format_products_to_documents(products_data)     
    vectorstore = create_vector_store(documents)                
    print("✅ Đã hoàn tất nạp dữ liệu từ SQL vào Vector Store!")


def create_hybrid_retriever():
    
    # 1. Tải Vector Store (Giữ nguyên)
    print("Đang tải mô hình embedding (HuggingFace)...")
    embedding_model = HuggingFaceEmbeddings(
        model_name="all-MiniLM-L6-v2", 
        model_kwargs={'device': 'cpu'}
    )
    
    print("Đang tải Vector Store (ChromaDB)...")
    vectorstore = Chroma(
        persist_directory="db/chroma_sql_store",
        embedding_function=embedding_model
    )

    # 2. TẠO RETRIEVER NÂNG CAO (HYBRID SEARCH) (Giữ nguyên)
    print("Đang lấy TẤT CẢ tài liệu từ ChromaDB để khởi tạo BM25...")
    all_docs = vectorstore.similarity_search("", k=1000) 
    
    if not all_docs:
        print("🔴 LỖI: Không tìm thấy tài liệu nào trong ChromaDB.")
        return None
        
    print(f"Đã lấy {len(all_docs)} tài liệu để huấn luyện BM25.")

    # Vector Retriever (Tìm kiếm ý nghĩa + Ngưỡng điểm tin cậy)
    retriever_vector = vectorstore.as_retriever(
        search_type="similarity_score_threshold",
        search_kwargs={
            "k": 3,
            "score_threshold": 0.3
        }
    )

    # BM25 Retriever (Tìm kiếm từ khóa)
    retriever_bm25 = BM25Retriever.from_documents(all_docs, k=3)

    # Ensemble Retriever (Kết hợp)
    ensemble_retriever = EnsembleRetriever(
        retrievers=[retriever_vector, retriever_bm25],
        weights=[0.7, 0.3]
    )
    
    print("✅ Đã tạo Hybrid Retriever thành công!")
    return ensemble_retriever

class ProductCard(BaseModel):
    """Cấu trúc dữ liệu cho một thẻ Card sản phẩm."""
    summary_text: str = Field(description="Câu trả lời tóm tắt cho người dùng (bằng tiếng Việt)")
    product_name: str = Field(description="Tên đầy đủ của sản phẩm liên quan nhất")
    image_url: str = Field(description="URL hình ảnh của sản phẩm đó")
    product_alias: str = Field(description="Alias (slug) của sản phẩm đó")
    id_pbsp: int = Field(description="ID phiên bản sản phẩm (id_pbsp) của sản phẩm đó")

JAVA_API_BASE_URL = "http://localhost:8080/Spring-mvc"

class OrderItem(BaseModel):
    product_name: str = Field(description="Tên sản phẩm")
    quantity: int = Field(description="Số lượng mua")
    color: str = Field(description="Màu sắc khách chọn (ví dụ: Đen, Tự nhiên)")
    capacity: str = Field(description="Phiên bản bộ nhớ. BẮT BUỘC theo định dạng 'RAM/ROM'. Ví dụ: '8GB/128GB', '12GB/512GB'. Nếu khách chỉ nói ROM, hãy hỏi lại hoặc tự điền RAM tương ứng.")    
    unit_price: int = Field(description="Đơn giá của sản phẩm (VNĐ)")
    # id_pbsp: int = Field(description="ID phiên bản sản phẩm (mapbsp) lấy từ dữ liệu Card")

# 2. Định nghĩa cấu trúc ĐẦU VÀO cho Tool Tạo Đơn
class CreateOrderInput(BaseModel):
    # Thông tin người mua (Shipping)
    username: str = Field(description="Tên người nhận hàng")
    phone: str = Field(description="Số điện thoại người nhận")
    email: str = Field(description="Email người nhận (nếu có, nếu không thì để chuỗi rỗng)")
    streetName: str = Field(description="Địa chỉ giao hàng tên đường (Số nhà, đường)")
    district: str = Field(description="Địa chỉ giao hàng tên quận (quận)")
    country: str = Field(description="Địa chỉ giao hàng tên thành phố (thành phố)")
    note: str = Field(description="Ghi chú đơn hàng (nếu có)", default="")
    
    # Danh sách sản phẩm (Quan trọng!)
    items: list[OrderItem] = Field(description="Danh sách các sản phẩm khách muốn mua")

@tool(args_schema=CreateOrderInput) # <-- Bắt buộc dòng này để Agent hiểu cấu trúc Input
def create_order_tool(username: str, phone: str, streetName: str, district: str, country: str, items: list[dict], email: str = "", note: str = "") -> str:
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

        return f"Đã tạo đơn hàng thành công! Mã đơn: {order_id}. Tổng tiền: {payload['toalAmount']:,} VNĐ. Link thanh toán: {payment_url}"

    except Exception as e:
        return f"Lỗi khi gọi API Java: {e}"


def get_payment_url_via_api(total: int, orderId: int):
   
    # Xây dựng URL chính xác như trong @PostMapping của bạn
    url = f"{JAVA_API_BASE_URL}/quan-tri/don-hang/atm/{total}"
    
    params = {
        "orderId": orderId
    }
    
    print(f"[Python] Đang gọi API Java (Lấy link MoMo): {url}")

    try:
      
        response = requests.post(url, params=params, json={}, timeout=10)
        response.raise_for_status() # Báo lỗi nếu API trả về 4xx hoặc 5xx
        
        # API Java trả về: {"payUrl": "https://..."}
        data = response.json()
        pay_url = data.get("payUrl")
        
        if not pay_url:
            raise Exception("API Java không trả về payUrl")
            
        print(f"[Python] API Java đã trả về link MoMo.")
        return pay_url

    except requests.exceptions.RequestException as e:
        print(f"LỖI KHI GỌI API THANH TOÁN: {e}")
        raise Exception(f"Lỗi kết nối đến server Java (thanh toán): {e}")

def create_product_card_chain(retriever, llm_model):
    """Tạo RAG Chain trả về JSON để làm Card."""
    template = """Bạn là trợ lý AI. Trả lời câu hỏi của khách hàng VÀ trả về dữ liệu Card của sản phẩm LIÊN QUAN NHẤT.

    Bối cảnh (Context): {context}
    Câu hỏi: {question}

    Nhiệm vụ:
    1. (summary_text): Viết câu trả lời (bằng tiếng Việt) cho câu hỏi của khách.
    2. (product_name, image_url, product_alias, id_pbsp): 
       Từ Bối cảnh (Context), tìm MỘT sản phẩm liên quan NHẤT.
       Lấy chính xác các giá trị 'product_name', 'image_url', 'product_alias', và 'id_pbsp' từ metadata của nó.

    Trả lời bằng định dạng JSON theo cấu trúc sau:
    {format_instructions}
    """
    llm = ChatGoogleGenerativeAI(
        model=llm_model,
        google_api_key=os.environ.get("GOOGLE_API_KEY"),
        temperature=0.1
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

def get_agent_executor(retriever, model_choice="gemini-2.5-flash"):
    
    print("\nĐang khởi tạo Agent Executor (Multi-Tool Mode)...")
    
    # 1. Khởi tạo LLM (Bộ não của Agent)
    llm = ChatGoogleGenerativeAI(
        model=model_choice,
        google_api_key=os.environ.get("GOOGLE_API_KEY"),
        temperature=0.01
    )
    
    # 2. Khởi tạo 2 Chain (2 công cụ)
    card_chain = create_product_card_chain(retriever, model_choice)

    # 3. Đóng gói thành 2 Tool
    
    tool_text = create_retriever_tool(
    retriever,
    "product_overview", # <--- ĐỔI TÊN CHO RÕ RÀNG
    """Dùng công cụ này khi người dùng hỏi chung chung (ví dụ: 'điện thoại nào pin trâu', 'so sánh A và B', 'giá tầm 10 triệu').
    Đầu vào là từ khóa tìm kiếm."""
    )

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

    tools = [tool_text, product_detail_card,create_order_tool]

    # 4. PROMPT TEMPLATE CHO AGENT (Dạy Agent cách chọn Tool)
    system = """Bạn là chuyên gia tư vấn điện thoại tên NVP-Chatbot.
Bạn có 3 công cụ hỗ trợ:
1. `product_overview`: Tra cứu thông tin chung, so sánh nhiều sản phẩm, tìm kiếm theo tính năng (pin trâu, chụp ảnh đẹp).
2. `product_detail_card`: Tra cứu chi tiết MỘT sản phẩm cụ thể để lấy hình ảnh và link mua hàng.
3. `create_order_tool`: Dùng để chốt đơn hàng và tạo link thanh toán.

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


--- QUY TẮC XỬ LÝ KẾT QUẢ TỪ TOOL `product_detail_card` ---
Khi bạn gọi `product_detail_card` và nhận được JSON:

* TRƯỜNG HỢP 1: Khách đang muốn MUA/ĐẶT HÀNG (Quy trình đặt hàng):
    - Hãy ĐỌC ngầm JSON để lấy chính xác `product_name` (Tên sản phẩm) và `price` (Giá bán).
    - TUYỆT ĐỐI KHÔNG trả về JSON đó cho khách (không hiện thẻ Card).
    - HÀNH ĐỘNG TIẾP THEO: Kiểm tra xem khách đã chốt Màu và Dung lượng chưa?
      + Nếu CHƯA chốt Màu/Dung lượng: Dùng thông tin từ JSON để gợi ý (ví dụ: "Dạ bản này có màu X, Y...").
      + Nếu ĐÃ chốt đủ: Chuyển sang Bước 2 (Hỏi số lượng).

* TRƯỜNG HỢP 2: Khách chỉ đang XEM/HỎI THÔNG TIN:
    - Hãy trả về NGUYÊN VĂN cái JSON đó làm câu trả lời cuối cùng (để hệ thống hiển thị thẻ Card cho khách xem).

--- QUY TRÌNH ĐẶT HÀNG (NGHIÊM NGẶT) ---
Khách hàng có thể mua nhiều sản phẩm. Bạn phải tuân thủ trình tự sau:
BƯỚC 1: XÁC ĐỊNH SẢN PHẨM & THUỘC TÍNH (QUAN TRỌNG NHẤT)
   - Nếu khách nói "Mua [Tên Sản Phẩm]" nhưng chưa rõ phiên bản (Màu/Dung lượng):
     1. **LIỆT KÊ RÕ RÀNG** từng phiên bản ra cho khách xem (Kèm Màu, Dung lượng RAM/ROM và Giá).
        *Ví dụ:*
        *"Dạ hiện tại iPhone 15 Pro Max bên em có các phiên bản sau:*
        *- Màu Titan Tự Nhiên, 256GB: 29.500.000đ*
        *- Màu Đen, 512GB: 32.000.000đ"*
     2. **CUỐI CÙNG MỚI HỎI:** "Anh/chị muốn lựa chọn phiên bản nào trong số trên ạ?"
   
   - ⚠️ LƯU Ý: Chỉ khi khách chốt đủ bộ 3 thông tin (Tên + Màu + Dung Lượng) thì mới được coi là xong bước này và chuyển sang bước hỏi số lượng.

BƯỚC 2: XÁC NHẬN SỐ LƯỢNG & MUA THÊM
- Hỏi khách: "Anh/chị muốn mua số lượng bao nhiêu?" và "Có muốn mua thêm sản phẩm nào khác không?".

BƯỚC 3: THU THẬP THÔNG TIN GIAO HÀNG
- Khi khách chốt xong sản phẩm, hãy khéo léo xin 4 thông tin: Tên người nhận, SĐT, Email (nếu có), Địa chỉ.

BƯỚC 4: TỔNG KẾT & CHỐT ĐƠN
- Tóm tắt lại toàn bộ đơn hàng: Các sản phẩm (kèm số lượng, đơn giá), Tổng tiền dự kiến, Thông tin giao hàng.
- Hỏi khách: "Anh/chị xác nhận thông tin này đúng chưa ạ?".

BƯỚC 5: GỌI TOOL
- Chỉ khi khách nhắn "Xác nhận" hoặc "Đúng rồi", bạn mới được gọi `create_order_tool`.

Lưu ý:
- Nếu khách chào hỏi, hãy chào lại lịch sự, không dùng tool.
- Nếu không tìm thấy thông tin sản phẩm, hãy xin lỗi và gợi ý sản phẩm khác.
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

def main():
    # BƯỚC 1: Nạp dữ liệu (Chỉ chạy một lần khi cần cập nhật data)
    run_ingestion_pipeline()
    
    # BƯỚC 2: Khởi tạo Retriever
    retriever = create_hybrid_retriever()
    if retriever is None:
       return

    # BƯỚC 3: Khởi tạo Agent Executor
    # (Sửa lại tên biến cho rõ ràng)
    agent_executor = get_agent_executor(retriever)
    if agent_executor is None:
       return

    print("\n" + "="*50)
    print("🤖 Trợ lý AI (Agent - Gemini) đã sẵn sàng. Bắt đầu chat.")
    print("Nhập 'thoat' hoặc 'exit' để kết thúc.")
    print("="*50)

    # BƯỚC 4: Vòng lặp chat tương tác
    chat_history = [] # Khởi tạo lịch sử chat
    
    while True:
       try:
           question = input("Bạn: ")
           if question.lower() in ["exit", "thoat", "quit"]:
               print("🤖 Tạm biệt! Cảm ơn bạn đã sử dụng dịch vụ.")
               break
           
           print("🤖 Đang xử lý (Agent Thinking)...")
           
           # GỌI AGENT ĐÚNG CÁCH
           response = agent_executor.invoke({
               "input": question,
               "chat_history": chat_history 
               # (Chúng ta sẽ cập nhật lịch sử chat sau)
           })
           
           # In ra output
           raw_output = response['output']
           final_text = ""
           
           if isinstance(raw_output, list):
               # NẾU LÀ DANH SÁCH (List of Dicts)
               # Nối tất cả các phần 'text' lại với nhau
               
               text_parts = [] # Tạo một list rỗng để chứa các phần
               for part in raw_output:
                   if isinstance(part, dict) and 'text' in part:
                       text_parts.append(part['text'])
                   elif isinstance(part, str) and 'extras' not in part:
                       text_parts.append(str(part)) # Dự phòng
               
               final_text = "".join(text_parts) # Nối các chuỗi lại
           
           elif isinstance(raw_output, str):
               # NẾU LÀ CHUỖI BÌNH THƯỜNG
               final_text = raw_output
           
           else:
               final_text = raw_output.get('summary_text', str(raw_output))
               #print(f"\n🤖: {final_text}\n")
               #response['output'] = final_text

               # Mô phỏng hiển thị Card
               print("--- [Dữ liệu Card (Gửi cho Frontend)] ---")
               print(f"   Tên: {raw_output.get('product_name')}")
               print(f"   Ảnh: {raw_output.get('image_url')}")
               print(f"   Link: http://localhost:8080/Spring-mvc/Detail?p={raw_output.get('product_alias')}&id_pbsp={raw_output.get('id_pbsp')}")
               print("----------------------------------------\n")

           # In ra chuỗi cuối cùng đã được làm sạch
           print(f"\n🤖: {final_text}\n")

           
           # (Phần nâng cao: Cập nhật lịch sử chat để Agent nhớ)
           chat_history.append(HumanMessage(content=question))
           #chat_history.append(AIMessage(content=response['output']))
           chat_history.append(AIMessage(final_text))
       except Exception as e:
           print(f"Đã xảy ra lỗi trong quá trình chat: {e}")


if __name__ == "__main__":
    main()