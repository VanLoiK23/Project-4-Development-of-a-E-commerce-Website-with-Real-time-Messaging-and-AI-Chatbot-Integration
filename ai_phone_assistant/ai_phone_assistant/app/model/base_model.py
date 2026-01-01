from pydantic import BaseModel, Field
from typing import Optional

class ProductCard(BaseModel):
    """Cấu trúc dữ liệu cho một thẻ Card sản phẩm."""
    summary_text: str = Field(description="Câu trả lời tóm tắt cho người dùng (bằng tiếng Việt)")
    product_name: str = Field(description="Tên đầy đủ của sản phẩm liên quan nhất")
    image_url: str = Field(description="URL hình ảnh của sản phẩm đó")
    product_alias: str = Field(description="Alias (slug) của sản phẩm đó")
    id_pbsp: int = Field(description="ID phiên bản sản phẩm (id_pbsp) của sản phẩm đó")

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
    
    customer_id: str = Field(description="ID của khách hàng (lấy từ system_note hoặc lịch sử chat). Nếu không có thì để trống.", default="")

    # Danh sách sản phẩm (Quan trọng!)
    items: list[OrderItem] = Field(description="Danh sách các sản phẩm khách muốn mua")

class ProductCardData(BaseModel):
    product_name: str
    image_url: str
    product_link: str
    id_pbsp: int

class ChatRequest(BaseModel):
    session_id: str  # ID phiên chat (để nhớ lịch sử từng user)
    message: str     # Câu hỏi của người dùng
    userId: str  # ID người dùng (userId)   

class ChatResponse(BaseModel):
    text: str # Câu trả lời dạng văn bản
    card: Optional[ProductCardData] = None # Dữ liệu thẻ Card (nếu có)