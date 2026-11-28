import { BlogPost, BlogCategory } from "@/types/blog";

export const MOCK_BLOG_CATEGORIES: BlogCategory[] = [
  { name: "Tất cả", slug: "all", count: 8 },
  { name: "Đánh giá chi tiết", slug: "danh-gia", count: 3 },
  { name: "So sánh máy", slug: "so-sanh", count: 2 },
  { name: "Tư vấn mua sắm", slug: "tu-van", count: 2 },
  { name: "Công nghệ & ABSA", slug: "cong-nghe", count: 1 },
];

export const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    id: "post-1",
    slug: "danh-gia-thuc-te-iphone-16-pro-max-qua-goc-nhin-absa",
    title: "Đánh giá thực tế iPhone 16 Pro Max qua 1.200 nhận xét cộng đồng (ABSA)",
    excerpt: "Thay vì chỉ dựa vào thông số kỹ thuật, hệ thống ABSA phân tích hơn 1.200 đánh giá thực tế của người dùng: Thời lượng pin và camera tele đạt 4.8/5, trong khi nhiệt độ sạc nhanh nhận phản hồi trung lập.",
    category: "Đánh giá chi tiết",
    categorySlug: "danh-gia",
    coverImage: "/images/blog/iphone-16-review.webp",
    author: {
      name: "Trần Anh Tuấn",
      role: "Chuyên gia phân tích dữ liệu phần cứng",
    },
    publishedAt: "2026-11-20T08:30:00Z",
    readTimeMinutes: 5,
    isFeatured: true,
    isWeeklyMostRead: true,
    tags: ["iPhone 16 Pro Max", "ABSA", "Đánh giá pin", "Camera"],
    relatedPhones: [
      {
        id: "phone-1",
        name: "iPhone 16 Pro Max 256GB",
        slug: "iphone-16-pro-max-256gb",
        price: 34990000,
        originalPrice: 36990000,
        image: "/images/phones/iphone-16-pro-max.webp",
        absaScore: 4.7,
        topAspect: {
          name: "Thời lượng pin",
          score: 4.8,
          sentiment: "positive",
        },
      },
      {
        id: "phone-2",
        name: "Samsung Galaxy S24 Ultra 256GB",
        slug: "samsung-galaxy-s24-ultra-256gb",
        price: 29990000,
        originalPrice: 33990000,
        image: "/images/phones/galaxy-s24-ultra.webp",
        absaScore: 4.6,
        topAspect: {
          name: "Hiệu năng đa nhiệm",
          score: 4.7,
          sentiment: "positive",
        },
      },
    ],
    content: `
      <h2>1. Vì sao cần phân tích ABSA thay vì chỉ xem thông số?</h2>
      <p>Khi một chiếc flagship mới ra mắt, bảng thông số luôn tràn ngập những con số ấn tượng: chip thế hệ mới nhất, cảm biến kích thước lớn, sạc công suất cao. Tuy nhiên, trải nghiệm cầm máy hàng ngày của người dùng thực tế mới là thước đo chính xác nhất.</p>
      <p>Hệ thống Aspect-Based Sentiment Analysis (ABSA) của Phone Store đã tự động trích xuất và phân loại các khía cạnh cốt lõi từ 1.200 đánh giá đã xác thực mua hàng:</p>
      <ul>
        <li><strong>Thời lượng pin & sử dụng on-screen:</strong> 4.8 / 5.0 (Tích cực chiếm 91%). Đa số người dùng xác nhận máy trụ vững hơn 8.5 giờ on-screen hỗn hợp.</li>
        <li><strong>Khả năng quay chụp chân dung & tele 5x:</strong> 4.7 / 5.0 (Tích cực chiếm 89%). Khả năng xử lý viền tóc và màu da được khen ngợi tự nhiên.</li>
        <li><strong>Nhiệt độ khi sạc nhanh và chơi game nặng:</strong> 3.6 / 5.0 (Trung lập). Khu vực gần cụm camera ấm lên rõ rệt khi tải game đồ họa cao trên 30 phút.</li>
      </ul>

      <h2>2. Chi tiết khía cạnh pin & sạc</h2>
      <p>Viên pin dung lượng lớn kết hợp với tiến trình 3nm tối ưu giúp mẫu máy đạt độ ổn định ấn tượng. Trong các phản hồi, người dùng văn phòng chia sẻ chỉ cần sạc 1 lần mỗi 1.5 ngày.</p>
      <p>Tuy vậy, tốc độ sạc thực tế khi pin chạm ngưỡng 80% giảm dần để bảo vệ tuổi thọ cell pin, khiến thời gian sạc đầy từ 0 - 100% mất khoảng 1 giờ 25 phút.</p>

      <h2>3. Lời khuyên chọn mua</h2>
      <p>Nếu bạn là người dùng ưu tiên độ bền pin, chất lượng quay video và độ giữ giá theo thời gian, đây là sự lựa chọn hàng đầu. Tuy nhiên, nếu bạn thường xuyên chơi game đồ họa cao ngoài trời, hãy cân nhắc thêm phụ kiện tản nhiệt rời.</p>
    `,
  },
  {
    id: "post-2",
    slug: "so-sanh-galaxy-s24-ultra-va-iphone-16-pro-max-absa",
    title: "So sánh Galaxy S24 Ultra vs iPhone 16 Pro Max: Cộng đồng đánh giá khía cạnh nào cao hơn?",
    excerpt: "Đối đầu trực tiếp giữa hai siêu phẩm hàng đầu: S24 Ultra vượt trội ở khía cạnh màn hình chống chói và bút S-Pen, trong khi iPhone 16 Pro Max dẫn đầu về quay video và độ mượt mà ứng dụng.",
    category: "So sánh máy",
    categorySlug: "so-sanh",
    coverImage: "/images/blog/s24u-vs-ip16pm.webp",
    author: {
      name: "Nguyễn Minh Hoàng",
      role: "Biên tập viên công nghệ",
    },
    publishedAt: "2026-11-18T14:15:00Z",
    readTimeMinutes: 6,
    isFeatured: false,
    isWeeklyMostRead: true,
    tags: ["So sánh", "Galaxy S24 Ultra", "iPhone 16 Pro Max"],
    relatedPhones: [
      {
        id: "phone-2",
        name: "Samsung Galaxy S24 Ultra 256GB",
        slug: "samsung-galaxy-s24-ultra-256gb",
        price: 29990000,
        originalPrice: 33990000,
        image: "/images/phones/galaxy-s24-ultra.webp",
        absaScore: 4.6,
        topAspect: {
          name: "Màn hình chống chói",
          score: 4.9,
          sentiment: "positive",
        },
      },
    ],
    content: `
      <h2>Cuộc đua giữa hai gã khổng lồ</h2>
      <p>Cả Galaxy S24 Ultra và iPhone 16 Pro Max đều đại diện cho đỉnh cao công nghệ di động hiện tại. Thay vì tranh cãi lý thuyết, hãy cùng phân tích điểm số ABSA từ hàng nghìn khách hàng thực tế.</p>
      <p>Về màn hình, Galaxy S24 Ultra với lớp kính Gorilla Armor chống chói nhận được điểm số kỷ lục 4.9/5 từ cộng đồng người dùng hay di chuyển ngoài trời.</p>
    `,
  },
  {
    id: "post-3",
    slug: "huong-dan-chon-smartphone-gaming-khong-lo-nong-may",
    title: "Bí quyết chọn smartphone chơi game mượt mà không lo quá nhiệt năm 2026",
    excerpt: "Cách đọc các khía cạnh tản nhiệt, độ ổn định khung hình FPS và dung lượng pin thực tế qua hệ thống gợi ý Phone Store trước khi quyết định xuống tiền.",
    category: "Tư vấn mua sắm",
    categorySlug: "tu-van",
    coverImage: "/images/blog/gaming-phone-guide.webp",
    author: {
      name: "Lê Quốc Bảo",
      role: "Reviewer thiết bị di động",
    },
    publishedAt: "2026-11-15T09:00:00Z",
    readTimeMinutes: 4,
    isFeatured: false,
    isWeeklyMostRead: true,
    tags: ["Gaming Phone", "Tản nhiệt", "Tư vấn mua máy"],
    content: `
      <h2>Khía cạnh tản nhiệt: Điểm yếu chí mạng của nhiều flagship</h2>
      <p>Nhiều người dùng chỉ chú ý đến điểm benchmark Antutu hay Geekbench mà quên mất rằng con chip mạnh đến đâu cũng sẽ bị bóp xung nếu nhiệt độ vượt quá 45°C.</p>
    `,
  },
  {
    id: "post-4",
    slug: "cong-nghe-absa-hoat-dong-nhu-the-nao",
    title: "Công nghệ ABSA là gì? Cách Phone Store bóc tách từng khía cạnh đánh giá",
    excerpt: "Tìm hiểu kiến trúc mô hình học máy xử lý ngôn ngữ tự nhiên tiếng Việt, giúp biến hàng vạn bình luận thô thành các chỉ số điểm khía cạnh minh bạch và khách quan.",
    category: "Công nghệ & ABSA",
    categorySlug: "cong-nghe",
    coverImage: "/images/blog/absa-explained.webp",
    author: {
      name: "Trần Anh Tuấn",
      role: "Chuyên gia phân tích dữ liệu phần cứng",
    },
    publishedAt: "2026-11-12T10:00:00Z",
    readTimeMinutes: 7,
    isFeatured: false,
    isWeeklyMostRead: false,
    tags: ["ABSA", "AI", "Machine Learning", "NLP Tiếng Việt"],
    content: `
      <h2>Bóc tách cảm xúc đa khía cạnh (Aspect-Based Sentiment Analysis)</h2>
      <p>Một nhận xét như: 'Máy chụp ảnh đẹp, màn hình rực rỡ nhưng pin tụt nhanh và máy khá nóng' chứa đựng cả cảm xúc khen ngợi lẫn phàn nàn trên các phần cứng khác nhau.</p>
      <p>Mô hình ABSA của chúng tôi phân loại chính xác: Camera (+), Màn hình (+), Pin (-), Tản nhiệt (-).</p>
    `,
  },
  {
    id: "post-5",
    slug: "top-5-dien-thoai-chup-anh-dep-nhat-tam-gia-15-trieu",
    title: "Top 5 điện thoại chụp ảnh đẹp nhất tầm giá 15 triệu được cộng đồng chấm điểm cao",
    excerpt: "Tổng hợp các mẫu smartphone cận cao cấp sở hữu cảm biến chống rung OIS, thuật toán xử lý chân dung xuất sắc và điểm hài lòng camera ABSA trên 4.5 sao.",
    category: "Tư vấn mua sắm",
    categorySlug: "tu-van",
    coverImage: "/images/blog/top-camera-phones.webp",
    author: {
      name: "Nguyễn Minh Hoàng",
      role: "Biên tập viên công nghệ",
    },
    publishedAt: "2026-11-10T11:20:00Z",
    readTimeMinutes: 5,
    isFeatured: false,
    isWeeklyMostRead: false,
    tags: ["Camera phone", "Tầm giá 15 triệu", "Tư vấn"],
    content: `
      <h2>Phân khúc 15 triệu: Điểm giao hoàn hảo giữa giá thành và chất lượng camera</h2>
      <p>Người dùng không nhất thiết phải chi hơn 30 triệu đồng để có được những bức ảnh chất lượng cao. Các mẫu máy phân khúc cận cao cấp hiện nay đều được kế thừa cảm biến từ dòng đầu bảng.</p>
    `,
  },
  {
    id: "post-6",
    slug: "danh-gia-xiaomi-14-trai-nghiem-sau-6-thang",
    title: "Đánh giá Xiaomi 14 sau 6 tháng sử dụng: Ống kính Leica và kích thước nhỏ gọn",
    excerpt: "Một trong những mẫu smartphone nhỏ gọn hiếm hoi trang bị cấu hình đỉnh bảng. Liệu thời lượng pin có đáp ứng đủ cho người dùng cường độ cao?",
    category: "Đánh giá chi tiết",
    categorySlug: "danh-gia",
    coverImage: "/images/blog/xiaomi-14-review.webp",
    author: {
      name: "Lê Quốc Bảo",
      role: "Reviewer thiết bị di động",
    },
    publishedAt: "2026-11-05T15:40:00Z",
    readTimeMinutes: 5,
    isFeatured: false,
    isWeeklyMostRead: false,
    tags: ["Xiaomi 14", "Leica", "Đánh giá chi tiết"],
    content: `
      <h2>Nhỏ gọn nhưng đầy nội lực</h2>
      <p>Với kích thước màn hình 6.36 inch viền siêu mỏng, Xiaomi 14 mang lại cảm giác cầm nắm đầm chắc và thoải mái bằng một tay.</p>
    `,
  },
];
