import mysql.connector 
from mysql.connector import Error
from langchain_core.documents import Document
from langchain_chroma import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings 
import shutil
import os

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
        
        print("✅ Img: "+first_image)

        print(f"DEBUG SP: {product['tensp']} - RAM: {product['kichthuocram']} - ROM: {product['kichthuocrom']} - MÀU: {product.get('tenmausac')}")

        # Create Document 
        doc = Document(page_content=content, metadata=metadata)

        documents.append(doc)
        
    print(f"✅ Đã tạo {len(documents)} Document phiên bản sản phẩm.")
    return documents



def create_vector_store(documents, persist_directory="../db/chroma_sql_store"):
   
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