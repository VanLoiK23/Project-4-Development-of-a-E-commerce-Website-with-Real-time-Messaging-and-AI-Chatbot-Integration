package com.thuongmaidientu.api.admin;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.apache.commons.codec.binary.Hex;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.thuongmaidientu.dto.CartDTO;
import com.thuongmaidientu.dto.CartItemDTO;
import com.thuongmaidientu.dto.ChiTietPhieuXuatDTO;
import com.thuongmaidientu.dto.CommentAndRateDTO;
import com.thuongmaidientu.dto.DiscountDTO;
import com.thuongmaidientu.dto.EmailRequest;
import com.thuongmaidientu.dto.MomoDTO;
import com.thuongmaidientu.dto.PaymentSavePending;
import com.thuongmaidientu.dto.PhienBanSanPhamDTO;
import com.thuongmaidientu.dto.PhieuXuatDTO;
import com.thuongmaidientu.dto.ProductDTO;
import com.thuongmaidientu.dto.PurchaseRequest;
import com.thuongmaidientu.dto.ResponseId;
import com.thuongmaidientu.dto.ThongTinGiaoHangDTO;
import com.thuongmaidientu.dto.UserDTO;
import com.thuongmaidientu.service.EmailService;
import com.thuongmaidientu.service.FcmService;
import com.thuongmaidientu.service.ICartService;
import com.thuongmaidientu.service.IChiTietPNService;
import com.thuongmaidientu.service.IChiTietPXService;
import com.thuongmaidientu.service.IChiTietSPService;
import com.thuongmaidientu.service.ICommentAndRateService;
import com.thuongmaidientu.service.IDiscountService;
import com.thuongmaidientu.service.IKhachHangService;
import com.thuongmaidientu.service.IMomoService;
import com.thuongmaidientu.service.IPhienbanspService;
import com.thuongmaidientu.service.IPhieuXuatService;
import com.thuongmaidientu.service.IProductService;
import com.thuongmaidientu.service.IThongTinGiaoHangService;

import jakarta.servlet.http.HttpSession;

@RestController(value = "phieuXuatApiOfAdmin")
@RequestMapping("/quan-tri/don-hang")
//@CrossOrigin(origins = "*") // Cho phép mọi nguồn truy cập
public class PhieuXuatAPI {
	@Autowired
	private IPhieuXuatService phieuXuatService;

	@Autowired
	private IChiTietPXService chiTietPXService;

	@Autowired
	private IChiTietPNService chiTietPNService;

	@Autowired
	private IProductService productService;

	@Autowired
	private IThongTinGiaoHangService thongTinGiaoHangService;

	@Autowired
	private IMomoService momoService;

	@Autowired
	private IChiTietSPService chiTietSPService;

	@Autowired
	private IPhienbanspService phienbanspService;

	@Autowired
	private IDiscountService discountService;

	@Autowired
	private ICartService cartService;

	@Autowired
	private IKhachHangService khachHangService;

	@Autowired
	private FcmService fcmService;

	@Autowired
	private ICommentAndRateService commentAndRateService;

	@Autowired
	private EmailService emailService;

	private final String endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";
	private final String partnerCode = "MOMOBKUN20180529";
	private final String accessKey = "klm05TvNBzhg7h7j";
	private final String secretKey = "at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa";
	private final String redirectUrl = "http://localhost:8080/Spring-mvc/Cart/thankyou";
//	private final String ipnUrl = "http://localhost:8080/Spring-mvc/quan-tri/don-hang/thankyou";
	private final String ipnUrl = "http://localhost:8080/Spring-mvc/Cart/thankyou";

	@PostMapping("/atm/{total}")
	public ResponseEntity<?> createPaymentATM(@PathVariable("total") Double total,
			// call by chat bot AI
			@RequestParam(value = "orderId", required = false) Integer orderIdUpdate) throws Exception {

		String orderId = String.valueOf(System.currentTimeMillis());
		String requestId = String.valueOf(System.currentTimeMillis());
		String orderInfo = "Thanh toán qua ATM";
		String requestType = "payWithATM";

		int amount = total.intValue();
		String extraData = "";

		if (orderIdUpdate != null) {
			extraData = "orderIdUpdate=" + orderIdUpdate;
		}
		// Build raw hash string
		String rawHash = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl="
				+ ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode
				+ "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;

		String signature = generateSignature(rawHash, secretKey);

		// Build payload
		Map<String, Object> payload = new HashMap<>();
		payload.put("partnerCode", partnerCode);
		payload.put("partnerName", "Test");
		payload.put("storeId", "MomoTestStore");
		payload.put("requestId", requestId);
		payload.put("amount", total);
		// save to momo
		payload.put("orderId", orderId);
		payload.put("orderInfo", orderInfo);
		payload.put("redirectUrl", redirectUrl);
		payload.put("ipnUrl", ipnUrl);
		payload.put("lang", "vi");
		payload.put("extraData", extraData);
		payload.put("requestType", requestType);
		payload.put("signature", signature);

		// Call MoMo API
		RestTemplate restTemplate = new RestTemplate();
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

		ResponseEntity<Map> momoResponse = restTemplate.exchange(endpoint, HttpMethod.POST, entity, Map.class);
		Map<String, Object> body = momoResponse.getBody();

		if (body != null && body.get("payUrl") != null) {
			return ResponseEntity.ok(Map.of("payUrl", body.get("payUrl")));
		} else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Không thể tạo yêu cầu thanh toán.");
		}
	}

	@PostMapping("/visa/{total}")
	public ResponseEntity<?> createPaymentVisa(@PathVariable("total") Double total,
			// call by chat bot AI
			@RequestParam(value = "orderId", required = false) Integer orderIdUpdate) throws Exception {

		String orderId = String.valueOf(System.currentTimeMillis());
		String requestId = String.valueOf(System.currentTimeMillis());
		String orderInfo = "Thanh toán qua Visa";
		String requestType = "payWithCC";

		int amount = total.intValue();
		String extraData = "";
		if (orderIdUpdate != null) {
			extraData = "orderIdUpdate=" + orderIdUpdate;
		}
		// Build raw hash string
		String rawHash = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl="
				+ ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode
				+ "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;

		String signature = generateSignature(rawHash, secretKey);

		// Build payload
		Map<String, Object> payload = new HashMap<>();
		payload.put("partnerCode", partnerCode);
		payload.put("partnerName", "Test");
		payload.put("storeId", "MomoTestStore");
		payload.put("requestId", requestId);
		payload.put("amount", total);
		payload.put("orderId", orderId);
		payload.put("orderInfo", orderInfo);
		payload.put("redirectUrl", redirectUrl);
		payload.put("ipnUrl", ipnUrl);
		payload.put("lang", "vi");
		payload.put("extraData", extraData);
		payload.put("requestType", requestType);
		payload.put("signature", signature);

		// Call MoMo API
		RestTemplate restTemplate = new RestTemplate();
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

		ResponseEntity<Map> momoResponse = restTemplate.exchange(endpoint, HttpMethod.POST, entity, Map.class);
		Map<String, Object> body = momoResponse.getBody();

		if (body != null && body.get("payUrl") != null) {
			return ResponseEntity.ok(Map.of("payUrl", body.get("payUrl")));
		} else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Không thể tạo yêu cầu thanh toán.");
		}
	}

	// save pending payment Info call by chat AI
	@PostMapping("/save_order_by_tool")
	public Integer saveOrderByToolWithPendingStatus(@RequestBody PaymentSavePending paymentInfo, HttpSession session) {
		UserDTO userDTO = (UserDTO) session.getAttribute("user");

		userDTO = new UserDTO();
		userDTO.setId(Long.valueOf(5));

//		if (userDTO == null || paymentInfo == null) {
//			return null;
//		}

		System.out.println(paymentInfo);

//		PaymentSavePending(productName=[Samsung Galaxy S23 Ultra, iPhone 16 Pro Max], toalAmount=86400000, quantity=[1, 1], unitPrice=[45900000, 40500000], capacity=[4GB/512GB, 4GB/256GB], color=[Tím, Hồng], username=Huy, email=huy@gmail.com, phone=0912392392, streetName=Tran Cao Van, district=Thanh Khue, city=Da Nang, country=Vietnam, note=, idShipping=1)

		if (paymentInfo == null || paymentInfo.getProductName() == null || paymentInfo.getProductName().isEmpty()) {
			return null;
		}

		List<Integer> maPBList = new ArrayList<Integer>();

		for (int i = 0; i < paymentInfo.getProductName().size(); i++) {
			String nameProduct = paymentInfo.getProductName().get(i);
			String capacity = paymentInfo.getCapacity().get(i);

			if (capacity == null || !capacity.contains("/")) {
				return null; // Hoặc xử lý lỗi
			}

			String[] parts = capacity.split("/");

			String ramString = parts[0].replaceAll("[^0-9]", "");
			Integer ramSize = ramString.isEmpty() ? 0 : Integer.parseInt(ramString);

			String romRaw = parts[1].toUpperCase();
			String romString = romRaw.replaceAll("[^0-9]", "");
			Integer romSize = romString.isEmpty() ? 0 : Integer.parseInt(romString);

			String color = paymentInfo.getColor().get(i);
			if (productService.checkExistTenSanPham(nameProduct)) {
				List<ProductDTO> productDTOs = productService.searchLikeName(nameProduct);

				if (productDTOs == null || productDTOs.size() == 0) {
					return null;
				}

				Long idVersion = phienbanspService.findIdVersionByConfig(productDTOs.get(0).getId().intValue(), ramSize,
						romSize, color);

				maPBList.add(idVersion.intValue());
			}
		}

		Random random = new Random();
		Integer codeCart = random.nextInt(10000);

		Integer shipId = paymentInfo.getIdShipping();
		String city = paymentInfo.getCity();
		String username = paymentInfo.getUsername();
		String district = paymentInfo.getDistrict();
		String street = paymentInfo.getStreetName();
		String email = paymentInfo.getEmail();
		String phone = paymentInfo.getPhone();
		String note = paymentInfo.getNote();
		Integer totalInt = paymentInfo.getToalAmount();
		BigDecimal total = BigDecimal.valueOf(totalInt);
		Integer feeTransport = (totalInt >= 5000000) ? 0 : 200000;

		boolean checkIsSameInfoAddress = false;

		ThongTinGiaoHangDTO thongTinGiaoHangDTO = (shipId != null) ? thongTinGiaoHangService.findById(shipId) : null;

		if (thongTinGiaoHangDTO != null) {
			checkIsSameInfoAddress = (thongTinGiaoHangDTO.getCity().equals(city))
					&& (thongTinGiaoHangDTO.getHoVaTen().equals(username))
					&& (thongTinGiaoHangDTO.getDistrict().equals(district))
					&& (thongTinGiaoHangDTO.getStreetName().equals(street))
					&& (thongTinGiaoHangDTO.getEmail().equals(email))
					&& (thongTinGiaoHangDTO.getSoDienThoai().equals(phone));
		} else {
			thongTinGiaoHangDTO = new ThongTinGiaoHangDTO();
		}

		// if info shipping haven't yet or change info
		if (!checkIsSameInfoAddress) {
			thongTinGiaoHangDTO = new ThongTinGiaoHangDTO();

			thongTinGiaoHangDTO.setCity(city);
			thongTinGiaoHangDTO.setHoVaTen(username);
			thongTinGiaoHangDTO.setDistrict(district);
			thongTinGiaoHangDTO.setStreetName(street);
			thongTinGiaoHangDTO.setEmail(email);
			thongTinGiaoHangDTO.setSoDienThoai(phone);
			thongTinGiaoHangDTO.setIdkh(userDTO.getId().intValue());
		}

		thongTinGiaoHangDTO.setNote(note);
		thongTinGiaoHangDTO.setCountry("Việt Nam");
		System.out.println(thongTinGiaoHangDTO);

		ThongTinGiaoHangDTO saveThongTinGiaoHangDTO = thongTinGiaoHangService.insertAddress(thongTinGiaoHangDTO);

		PhieuXuatDTO phieuXuatDTO = new PhieuXuatDTO();

		phieuXuatDTO.setTongTien(total);
		phieuXuatDTO.setIDKhachHang(userDTO.getId().intValue());
		phieuXuatDTO.setPayment("pending");
		phieuXuatDTO.setCartShipping(saveThongTinGiaoHangDTO.getId().intValue());
		phieuXuatDTO.setDiscountCode(null);
		phieuXuatDTO.setFeeTransport((feeTransport > 0) ? 1 : 0);
		phieuXuatDTO.setCodeCart(codeCart.toString());
		phieuXuatDTO.setStatus(0);// status confirm

		PhieuXuatDTO savePhieuXuatDTO = phieuXuatService.save(phieuXuatDTO);

		if (savePhieuXuatDTO != null) {
			List<Integer> list_mapbspIntegers = new ArrayList<Integer>();

			for (Integer i = 0; i < maPBList.size(); i++) {
				ChiTietPhieuXuatDTO chiTietPhieuXuatDTO = new ChiTietPhieuXuatDTO();
				chiTietPhieuXuatDTO.setCodeCart(codeCart.toString());
				chiTietPhieuXuatDTO.setPhieuXuatId(savePhieuXuatDTO.getId().intValue());
				chiTietPhieuXuatDTO.setPhienBanSanPhamXuatId(maPBList.get(i));
				chiTietPhieuXuatDTO.setDonGia(paymentInfo.getUnitPrice().get(i));
				chiTietPhieuXuatDTO.setSoLuong(paymentInfo.getQuantity().get(i));

				list_mapbspIntegers.add(maPBList.get(i));

				chiTietPXService.saveCTPX(chiTietPhieuXuatDTO);

				// update quantity product in stock
				for (Long imei : chiTietSPService.selectListImei(maPBList.get(i),
						PageRequest.of(0, paymentInfo.getQuantity().get(i)))) {
					chiTietSPService.updateCTSP(savePhieuXuatDTO.getId().intValue(), maPBList.get(i), imei);
				}

				Integer slInteger = chiTietPXService.countNumberProductXuatANDMaPBSP(maPBList.get(i),
						savePhieuXuatDTO.getId().intValue());
				phienbanspService.updateSL(maPBList.get(i), (-slInteger)); // update quantity version product
			}

			Map<Integer, List<Integer>> mapMaspToMapbspList = new HashMap<>();

			for (Integer i : list_mapbspIntegers) {
				Integer productID = phienbanspService.findMaSP(i);

				// Nếu productID chưa có trong map thì tạo list mới
				mapMaspToMapbspList.computeIfAbsent(productID, k -> new ArrayList<>()).add(i);
			}

			for (Map.Entry<Integer, List<Integer>> entry : mapMaspToMapbspList.entrySet()) {
				Integer masp = entry.getKey();

				Integer quantityInStock = chiTietSPService.getQuantityProductByStatus(masp, 0);
				Integer quantityExport = chiTietSPService.getQuantityProductByStatus(masp, 1);

				Integer quantityImport = quantityExport + quantityInStock;
				productService.updateSLProduct(quantityImport, quantityExport, masp);// update quantity product overall
			}

			return savePhieuXuatDTO.getId().intValue();
		}

		return null;
	}

	/*
	 * @GetMapping("/thankyou") public ResponseEntity<String> handleMomoReturn() {
	 * String html =
	 * "<html><body><script>window.location.href='myapp://momo-payment-success'</script></body></html>";
	 * return ResponseEntity.ok().contentType(MediaType.TEXT_HTML).body(html); }
	 */

	@PostMapping("/sendEmail")
	public ResponseEntity<String> sendOrderEmail(@RequestBody EmailRequest emailRequest) {
		try {
			emailService.sendOrderEmail(emailRequest.getToEmail(), emailRequest.getOrderItems(),
					emailRequest.getTotal());
			return ResponseEntity.ok("Email sent successfully");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send email");
		}
	}

	@DeleteMapping
	public ResponseEntity<String> deletePX(@RequestParam("id") int id) {
		try {
			phieuXuatService.updateTrash(id, "disable");
			return ResponseEntity.ok("Delete Success");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi xóa sản phẩm");
		}
	}

	@GetMapping("/showdetails")
	public ResponseEntity<?> showdetails(@RequestParam("id") int id) {
		try {
			PhieuXuatDTO dto = phieuXuatService.findById(id);

			List<ChiTietPhieuXuatDTO> chiTietPhieuXuatDTOs = chiTietPXService.getListCTPX(dto.getId().intValue());

			List<Map<String, Object>> saveObjects = new ArrayList<>();

			for (ChiTietPhieuXuatDTO it : chiTietPhieuXuatDTOs) {
				Object[] productData = productService
						.findChiTietPhienBanSanPhamByPhieuXuat(it.getPhienBanSanPhamXuatId(), dto.getId().intValue())
						.get(0);

				List<Long> imeisList = new ArrayList<>();
				for (Object[] result : productService
						.findChiTietPhienBanSanPhamByPhieuXuat(it.getPhienBanSanPhamXuatId(), dto.getId().intValue())) {
					imeisList.add((Long) result[6]); // hoặc: Long.parseLong(result[6].toString())
				}

				Map<String, Object> productInfo = new HashMap<>();
				productInfo.put("info", productData);
				productInfo.put("imeis", imeisList);

				saveObjects.add(productInfo);
			}

			dto.setProduct_info(saveObjects);

			return ResponseEntity.ok(dto);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi lấy danh sách sản phẩm" + e);
		}
	}

	@GetMapping("/status/{id}/{status}")
	public ResponseEntity<String> updateStatus(@PathVariable("id") int id, @PathVariable("status") int status) {
		try {
			phieuXuatService.updateStatus(id, status);
			String token = khachHangService.getTokenUser(phieuXuatService.getUserIdByOrder(id));
			Map<String, Object> data = new HashMap<>();
			data.put("order_id", id);
			data.put("status", status);
			String result = null;
			if (token != null) {
				if (status == 1) {
					result = fcmService.sendNotification(token, "Đơn hàng #" + id + " đã được duyệt",
							"Cảm ơn bạn đã mua hàng. Đơn sẽ được giao sớm nhất.", data);
				} else if (status == 3) {
					result = fcmService.sendNotification(token, "Đơn hàng #" + id + " đang được giao",
							"Cảm ơn bạn đã mua hàng. Đơn sẽ được giao sớm nhất.", data);
				} else if (status == 4) {
					result = fcmService.sendNotification(token, "Đơn hàng #" + id + " đã giao",
							"Cảm ơn bạn đã mua hàng.", data);
				} else if (status == -1) {
					result = fcmService.sendNotification(token, "Đơn hàng #" + id + " đã bị nhân viên hủy",
							"Xin lỗi vì bất tiện này.", data);
					cancleOrder(id);
				} else if (status == -3) {
					result = fcmService.sendNotification(token, "Phiếu hủy của đơn hàng #" + id + " đã được duyệt",
							"Cảm ơn bạn đã phản hồi chúng tôi sẽ khắc phục.", data);
					cancleOrder(id);
				}
			} else {
				if (status == -1 || status == -3) {
					cancleOrder(id);
				}
			}
			System.out.println(result);
			return ResponseEntity.ok("Update success" + token);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi xóa sản phẩm");
		}
	}

	private void cancleOrder(Integer orderID) {
		List<Integer> list_mapbspIntegers = new ArrayList<Integer>();

		chiTietPXService.getListCTPX(orderID).forEach(ctpx -> {
			Integer ma_pbsp = ctpx.getPhienBanSanPhamXuatId();

			list_mapbspIntegers.add(ma_pbsp);

			for (Long imei : chiTietSPService.selectListImeiForCancle(orderID, ma_pbsp)) {
				chiTietSPService.updateCTSPForCancle(orderID, ma_pbsp, imei);
			}

			// Not different with ctpx.getSoluong()???
			Integer slInteger = chiTietPXService.countNumberProductXuatANDMaPBSP(ma_pbsp, orderID);
			phienbanspService.updateSL(ma_pbsp, (+slInteger));
		});

		Map<Integer, List<Integer>> mapMaspToMapbspList = new HashMap<>();

		for (Integer i : list_mapbspIntegers) {
			Integer productID = phienbanspService.findMaSP(i);

			// Nếu productID chưa có trong map thì tạo list mới
			mapMaspToMapbspList.computeIfAbsent(productID, k -> new ArrayList<>()).add(i);
		}

		for (Map.Entry<Integer, List<Integer>> entry : mapMaspToMapbspList.entrySet()) {
			Integer masp = entry.getKey();
			List<Integer> mapbspList = entry.getValue();

			Integer quantityInStock = chiTietSPService.getQuantityProductByStatus(masp, 0);
			Integer quantityExport = chiTietSPService.getQuantityProductByStatus(masp, 1);

			Integer quantityImport = quantityExport + quantityInStock;
			productService.updateSLProduct(quantityImport, quantityExport, masp);

		}
	}

	@PostMapping
	public ResponseEntity<String> exportSP(@RequestBody PurchaseRequest request

//			@RequestParam(value = "partner_code") String partner_code,
//			@RequestParam(value = "order_Id") Integer order_Id,
//			@RequestParam(value = "amount") Double amount,
//			@RequestParam(value = "order_info") String order_info,
//			@RequestParam(value = "order_type") String order_type,
//			@RequestParam(value = "trans_id") Integer trans_id,
//			@RequestParam(value = "pay_Type") String pay_Type,
//			@RequestParam(value = "code_cart") Integer code_cart,
//
//
//			@RequestParam(value = "tongtien") Double tongtien,
//			@RequestParam(value = "makh") Integer makh,
//			@RequestParam(value = "status") Integer status,
//			@RequestParam(value = "payment") String payment,
//			@RequestParam(value = "cart_shipping") Integer cart_shipping,
//			@RequestParam(value = "discount_code") Integer discount_code,
//			@RequestParam(value = "fee_transport") Integer fee_transport,
//			@RequestParam(value = "feeback") String feeback,
//			
//			
//			@RequestParam(value = "maphienbansp") Integer maphienbansp,
//			@RequestParam(value = "soluong") Integer soluong,
//			@RequestParam(value = "dongia") Double dongia
	) {

		boolean checkMomo = false;

		// cash
		if (request.getMomo().getPartnerCode().isBlank() || request.getMomo().getPartnerCode().isEmpty()) {
			checkMomo = true;
		}
		// via momo
		else {
			MomoDTO momoDTO = new MomoDTO();

			momoDTO.setPartnerCode(request.getMomo().getPartnerCode());
			momoDTO.setOrderId(request.getMomo().getOrderId());
			momoDTO.setOrderInfo(request.getMomo().getOrderInfo());
			momoDTO.setOrderType(request.getMomo().getOrderType());
			momoDTO.setAmount(request.getMomo().getAmount().toString());
			momoDTO.setTransId(request.getMomo().getTransId());
			momoDTO.setCodeCart(request.getMomo().getCodeCart().toString());
			momoDTO.setPayType(request.getMomo().getPayType());

			checkMomo = momoService.insertMomo(momoDTO);
		}

		if (checkMomo) {
			PhieuXuatDTO phieuXuatDTO = new PhieuXuatDTO();

			phieuXuatDTO.setTongTien(request.getDonhang().getTongTien());
			phieuXuatDTO.setIDKhachHang(request.getDonhang().getMakh());
			System.out.println(request.getDonhang().getMakh());
			phieuXuatDTO.setPayment(request.getDonhang().getPayment());
			phieuXuatDTO.setCartShipping(request.getDonhang().getCartShipping());
			phieuXuatDTO.setDiscountCode(request.getDonhang().getDiscountCode());
			phieuXuatDTO.setFeeTransport(request.getDonhang().getFeeTransport());
			phieuXuatDTO.setCodeCart(request.getDonhang().getCodeCart());
			phieuXuatDTO.setStatus(request.getDonhang().getStatus());

			if (request.getDonhang().getDiscountCode() != null) {
				discountService.decrese(request.getDonhang().getDiscountCode());
			}

			PhieuXuatDTO savePhieuXuatDTO = phieuXuatService.save(phieuXuatDTO);

			List<Integer> list_mapbspIntegers = new ArrayList<Integer>();

			if (savePhieuXuatDTO != null) {

//			    function export($ma_phieuxuat, $maphienbansp, $num, $dongia, $code_cart)
//			    {
//			        $sql1 = "INSERT INTO chitietphieuxuat (maphieuxuat, maphienbansp, soluong, dongia,code_cart) VALUES (?, ?, ?, ?, ?)";
//			        $sql2 = "UPDATE ctsanpham SET maphieuxuat=?, tinhtrang=1 WHERE maphienbansp=? AND maimei=?";

				for (ChiTietPhieuXuatDTO ct : request.getChitietphieuxuatList()) {

					int ma_pbsp = ct.getPhienBanSanPhamXuatId();
					int num = ct.getSoLuong();
					ct.setPhieuXuatId(savePhieuXuatDTO.getId().intValue());

					list_mapbspIntegers.add(ma_pbsp);

					chiTietPXService.saveCTPX(ct);

					for (Long imei : chiTietSPService.selectListImei(ma_pbsp, PageRequest.of(0, num))) {
						chiTietSPService.updateCTSP(savePhieuXuatDTO.getId().intValue(), ma_pbsp, imei);
					}

					Integer slInteger = chiTietPXService.countNumberProductXuatANDMaPBSP(ma_pbsp,
							savePhieuXuatDTO.getId().intValue());
					phienbanspService.updateSL(ma_pbsp, (-slInteger));

				}
				Map<Integer, List<Integer>> mapMaspToMapbspList = new HashMap<>();

				for (Integer i : list_mapbspIntegers) {
					Integer productID = phienbanspService.findMaSP(i);

					// Nếu productID chưa có trong map thì tạo list mới
					mapMaspToMapbspList.computeIfAbsent(productID, k -> new ArrayList<>()).add(i);
				}

				for (Map.Entry<Integer, List<Integer>> entry : mapMaspToMapbspList.entrySet()) {
					Integer masp = entry.getKey();
					List<Integer> mapbspList = entry.getValue();
//
//					int soluongnhap = 0;
//					int soluongban = 0;
//
//					if (masp != null) {
////						for (int i : mapbspList) {
////							soluongnhap += chiTietPNService.countNumberProductNhap(i);
////							soluongban += chiTietPXService.countNumberProductSold(i);
////						}
//
//						for (int i : phienbanspService.selectAllMaPBSPByMaSP(masp)) {
//							soluongnhap += chiTietPNService.countNumberProductNhap(i);
//							soluongban += chiTietPXService.countNumberProductSold(i);
//						}
//					}
//					productService.updateSLProduct(soluongnhap, soluongban, masp);

					Integer quantityInStock = chiTietSPService.getQuantityProductByStatus(masp, 0);
					Integer quantityExport = chiTietSPService.getQuantityProductByStatus(masp, 1);

					Integer quantityImport = quantityExport + quantityInStock;
					productService.updateSLProduct(quantityImport, quantityExport, masp);

				}
				return ResponseEntity.ok("Export Success");
			}
		}

		return ResponseEntity.ok("Export Failed");
	}

	@GetMapping("/cart")
	public ResponseEntity<?> getAllCarts() {
		try {

			List<CartDTO> list = cartService.getAllCarts();

			return ResponseEntity.ok(list);

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Lỗi khi lấy khách hàng: " + e.getMessage());
		}
	}

	@PutMapping("/cart")
	public void updateAllCart(@RequestBody CartDTO cart) {
		try {
			if (cart != null) {
				System.out.println(cart);

				CartDTO cartDTO = cartService.updateCart(cart);

				if (cartDTO != null) {

					if (cart.getCartItems() != null) {
						List<Integer> idVersionAbsentInListCartItem = new ArrayList<>();
						List<Integer> allVersionIdInListCartItem = cartService
								.getListVerionProductIdByCartId(cartDTO.getId());

						List<Integer> remainingVersionIds = new ArrayList<>(allVersionIdInListCartItem);

						for (CartItemDTO cartItem : cart.getCartItems()) {
							remainingVersionIds.removeIf(id -> id.equals(cartItem.getMaphienbansp()));

							Integer cartItemIdExist = cartService.isExistVersionProduct(cartDTO.getId(),
									cartItem.getMaphienbansp());
							System.out.println("cartItemIdExist: " + cartItemIdExist);

							if (cartItemIdExist != null) {
								CartItemDTO cartItemDTO = cartService.findByCartItemID(cartItemIdExist);
								cartItemDTO.setSoluong(cartItem.getSoluong());
								cartService.updateCartItem(cartDTO.getId(), cartItemDTO);
							} else {
								cartItem.setCart_item_id(null);
								cartService.updateCartItem(cartDTO.getId(), cartItem);
							}
						}

						idVersionAbsentInListCartItem.addAll(remainingVersionIds);
						for (Integer idAbsent : idVersionAbsentInListCartItem) {
							cartService.deleteCartItemByVersionId(cartDTO.getId(), idAbsent);
						}

					} else {
						cartService.deleteAllCartItemByCartId(cartDTO.getId());
					}
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@PutMapping("/cart/completed/{cartId}")
	public void setCartCompleted(@PathVariable("cartId") Integer cartId) {
		try {
			if (cartId != null) {
				CartDTO cartDTO = cartService.getCartById(cartId);

				cartDTO.setStatus("completed");

				cartService.updateCart(cartDTO);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@GetMapping("/discount")
	public ResponseEntity<?> getAllDiscount() {
		try {
			List<DiscountDTO> dtoList = discountService.selectAll();

			return ResponseEntity.ok(dtoList);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi lấy danh sách sản phẩm");
		}
	}

	@GetMapping("/address/{id}")
	public ResponseEntity<?> getAllAddress(@PathVariable("id") int id) {
		try {
			List<ThongTinGiaoHangDTO> dtoList = thongTinGiaoHangService.getAllByIdkh(id);

			return ResponseEntity.ok(dtoList);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi lấy danh sách sản phẩm");
		}
	}

	// POST: Thêm mới địa chỉ
	@PostMapping("/address")
	public ResponseEntity<ThongTinGiaoHangDTO> addAddress(@RequestBody ThongTinGiaoHangDTO address) {
		ThongTinGiaoHangDTO created = thongTinGiaoHangService.insertAddress(address);
		return ResponseEntity.ok(created);
	}

	// PUT: Cập nhật địa chỉ
	@PutMapping("/address/{id}")
	public ResponseEntity<?> updateAddress(@PathVariable("id") int id, @RequestBody ThongTinGiaoHangDTO address) {
		address.setId(Long.valueOf(id));
		boolean success = thongTinGiaoHangService.insertAddress(address) != null;
		if (success) {
			return ResponseEntity.ok("Update Success");
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not found");
		}
	}

	// DELETE: Xóa địa chỉ
	@DeleteMapping("/address/{id}")
	public ResponseEntity<Void> deleteAddress(@PathVariable("id") int id) {
		boolean deleted = thongTinGiaoHangService.deleteAddress(id);
		return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
	}

	// tao khoa bao mat cho mo mo
	public String generateSignature(String rawData, String secretKey) throws Exception {
		Mac sha256Hmac = Mac.getInstance("HmacSHA256");
		SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
		sha256Hmac.init(secretKeySpec);
		byte[] hashBytes = sha256Hmac.doFinal(rawData.getBytes(StandardCharsets.UTF_8));
		return Hex.encodeHexString(hashBytes);
	}

	@GetMapping("/orderOfMy/{id}")
	public ResponseEntity<?> getAllOrderByUserId(@PathVariable("id") int id) {
		try {

			List<PhieuXuatDTO> phieuXuatDTOs = phieuXuatService.getAllOrderByUserID(id);

			phieuXuatDTOs.forEach(phieuxuat -> {
				PhieuXuatDTO infoShippingDto = phieuXuatService.getInfoShipping(phieuxuat.getId().intValue());

				phieuxuat.setName(infoShippingDto.getName());
				phieuxuat.setPhone(infoShippingDto.getPhone());
				phieuxuat.setAddress(infoShippingDto.getAddress());

				if (phieuxuat.getDiscountCode() != null) {
					phieuxuat.setInfoOrderDiscount(discountService.findById(phieuxuat.getDiscountCode()));
				}

				List<ChiTietPhieuXuatDTO> chiTietPhieuXuatDTOs = chiTietPXService
						.getListCTPX(phieuxuat.getId().intValue());

				chiTietPhieuXuatDTOs.forEach(ct -> {
					ProductDTO dto = productService.findProductByIDtosForAndroid(ct.getPhienBanSanPhamXuatId());

					ct.setTenSP(dto.getTenSanPham());
					ct.setMaSP(dto.getMap());
					if (dto.getKichThuocRam() == null) {
						ct.setConfig(dto.getColor());
					} else {
						ct.setConfig(dto.getKichThuocRam() + " GB-" + dto.getKichThuocRom() + " GB-" + dto.getColor());
					}
					ct.setSrcImage(dto.getHinhAnh().split(",")[0]);
				});
				phieuxuat.setListctpx(chiTietPhieuXuatDTOs);
			});

			return ResponseEntity.ok(phieuXuatDTOs);

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Lỗi khi lấy khách hàng: " + e.getMessage());
		}
	}

	@GetMapping
	public ResponseEntity<?> getAllOrder() {
		try {

			List<PhieuXuatDTO> phieuXuatDTOs = phieuXuatService.selectAll();

			phieuXuatDTOs.forEach(phieuxuat -> {
				PhieuXuatDTO infoShippingDto = phieuXuatService.getInfoShipping(phieuxuat.getId().intValue());

				phieuxuat.setName(khachHangService.findById(phieuxuat.getIDKhachHang()).getHoTen());
				phieuxuat.setPhone(infoShippingDto.getPhone());
				phieuxuat.setAddress(infoShippingDto.getAddress());

				if (phieuxuat.getDiscountCode() != null) {
					phieuxuat.setInfoOrderDiscount(discountService.findById(phieuxuat.getDiscountCode()));
				}

				List<ChiTietPhieuXuatDTO> chiTietPhieuXuatDTOs = chiTietPXService
						.getListCTPX(phieuxuat.getId().intValue());

				chiTietPhieuXuatDTOs.forEach(ct -> {
					ProductDTO dto = productService.findProductByIDtosForAndroid(ct.getPhienBanSanPhamXuatId());

					ct.setTenSP(dto.getTenSanPham());
					ct.setMaSP(dto.getMap());
					if (dto.getKichThuocRam() == null) {
						ct.setConfig(dto.getColor());
					} else {
						ct.setConfig(dto.getKichThuocRam() + " GB-" + dto.getKichThuocRom() + " GB-" + dto.getColor());
					}
					ct.setSrcImage(dto.getHinhAnh().split(",")[0]);
				});
				phieuxuat.setListctpx(chiTietPhieuXuatDTOs);
			});

			return ResponseEntity.ok(phieuXuatDTOs);

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Lỗi khi lấy khách hàng: " + e.getMessage());
		}
	}

	@PutMapping("/cancel/{id}/{reason}")
	public void updateStatusCancle(@PathVariable("id") Integer id, @PathVariable("reason") String reason) {
		phieuXuatService.updateStatusCancel(id, reason);
	}

	@PostMapping("/review")
	public ResponseEntity<?> saveReview(@RequestBody CommentAndRateDTO review) {
		try {
			ResponseId responseId = new ResponseId();
			responseId.setId(commentAndRateService.save(review).getId().intValue());

//			productService.updateReviewProduct(1, review.getRate(), review.getId_sp().longValue());
			syncProductRatings();
			return ResponseEntity.ok(responseId);

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Lỗi khi lấy khách hàng: " + e.getMessage() + review.toString());
		}
	}

	public void syncProductRatings() {
		List<ProductDTO> allProducts = productService.getALlProducts();

		for (ProductDTO product : allProducts) {
			List<CommentAndRateDTO> ratings = commentAndRateService.findByProductId(product.getId().intValue());

			int soLuongDanhGia = ratings.size();
			double tongSao = ratings.stream().mapToDouble(CommentAndRateDTO::getRate).sum();

			product.setSoLuongDanhGia(soLuongDanhGia);
			product.setTongSao(tongSao);
			productService.updateReviewProductAll(soLuongDanhGia, tongSao, product.getId());
		}
	}

	@PutMapping("/review")
	public void updateReview(@RequestBody CommentAndRateDTO review) {
		try {
			commentAndRateService.updateReview(review);
		} catch (Exception e) {
		}
	}
//
//
//
//	@GetMapping(value = "/show_details_sp", produces = "application/json; charset=UTF-8")
//	public ResponseEntity<ProductDTO> showDetailsSp(@RequestParam("id") int id) {
//		try {
//			ProductDTO pDto = productService.findById(id);
//			if (pDto == null) {
//				return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
//			}
//			return ResponseEntity.ok(pDto);
//		} catch (Exception e) {
//			e.printStackTrace();
//			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//		}
//	}
//
//	@GetMapping(value = "/import_sp", produces = "application/json; charset=UTF-8")
//	public ResponseEntity<Map<String, Object>> import_sp(@RequestParam("id") int id) {
//		try {
//			ProductDTO pDto = productService.findById(id);
//			if (pDto == null) {
//				return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
//			}
//
//			// Lấy danh sách phiên bản sản phẩm
//			List<PhienBanSanPhamDTO> list_pb = phienbanspService.findAll(id);
//
//			// Đóng gói response thành JSON
//			Map<String, Object> response = new HashMap<>();
//			response.put("details_sp", pDto);
//			response.put("list_pb", list_pb);
//
//			return ResponseEntity.ok(response);
//		} catch (Exception e) {
//			e.printStackTrace();
//			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//		}
//	}
//
//	@GetMapping(value = "/show_config_sp", produces = "application/json; charset=UTF-8")
//	public ResponseEntity<String> show_config_sp(@RequestParam("id") int id) {
//		try {
//			List<PhienBanSanPhamDTO> pDto = phienbanspService.findAll(id);
//			if (pDto == null) {
//				return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
//			}
//			String str = "";
//			int i = 0;
//
//			for (PhienBanSanPhamDTO phienBanSanPhamDTO : pDto) {
//				i++;
//				str += "<tr>"; // Mở hàng table
//
//				str += "<td>" + i + "</td>";
//
//				// Kiểm tra RAM
//				if (phienBanSanPhamDTO.getRam() == null) {
//					str += "<td>Không</td>";
//				} else {
//					str += "<td>" + phienBanSanPhamDTO.getRam() + " GB</td>";
//				}
//
//				// Kiểm tra ROM
//				if (phienBanSanPhamDTO.getRom() == null) {
//					str += "<td>Không</td>";
//				} else {
//					str += "<td>" + phienBanSanPhamDTO.getRom() + " GB</td>";
//				}
//
//				// Màu sắc
//				str += "<td>" + phienBanSanPhamDTO.getColor() + "</td>";
//
//				// Giá nhập
//				str += "<td>" + String.format("%,d", phienBanSanPhamDTO.getGiaNhap()) + " ₫</td>";
//
//				// Giá xuất
//				str += "<td>" + String.format("%,d", phienBanSanPhamDTO.getGiaXuat()) + " ₫</td>";
//
//				str += "</tr>"; // Đóng hàng table
//			}
//
//			return ResponseEntity.ok(str);
//		} catch (Exception e) {
//			e.printStackTrace();
//			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//		}
//	}
//
//	@GetMapping(value = "/search", produces = "application/json; charset=UTF-8")
//	public ResponseEntity<List<ProductDTO>> search(@RequestParam("name") String name) {
//		try {
//			List<ProductDTO> pDto = productService.searchLikeName(name);
//			if (pDto == null || pDto.isEmpty()) {
//				return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
//			}
//			return ResponseEntity.ok(pDto);
//		} catch (Exception e) {
//			e.printStackTrace();
//			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//		}
//
//	}
//	
//	@RequestMapping(value = "/check-product-name", method = RequestMethod.GET)
//	@ResponseBody
//	public Map<String, Object> checkProductName(@RequestParam("tensp") String tensp) {
//	    Map<String, Object> response = new HashMap<>();
//	    boolean exists = productService.checkExistTenSanPham(tensp); // Kiểm tra tên sản phẩm trong database
//	    
//	    response.put("exists", exists); // Trả về true nếu sản phẩm đã tồn tại, false nếu không
//	    
//	    return response;
//	}

}
