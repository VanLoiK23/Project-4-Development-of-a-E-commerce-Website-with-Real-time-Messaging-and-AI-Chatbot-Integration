package com.thuongmaidientu.api.admin;

import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.thuongmaidientu.dto.ChiTietPhieuXuatDTO;
import com.thuongmaidientu.dto.DiscountDTO;
import com.thuongmaidientu.dto.KhachHangDTO;
import com.thuongmaidientu.dto.PaymentStatisticalDTO;
import com.thuongmaidientu.dto.PhieuXuatDTO;
import com.thuongmaidientu.dto.ProductDTO;
import com.thuongmaidientu.dto.ThongTinGiaoHangDTO;
import com.thuongmaidientu.dto.ThongkeDTO;
import com.thuongmaidientu.dto.UserDTO;
import com.thuongmaidientu.service.IChiTietPXService;
import com.thuongmaidientu.service.IDiscountService;
import com.thuongmaidientu.service.IKhachHangService;
import com.thuongmaidientu.service.IPhieuNhapService;
import com.thuongmaidientu.service.IPhieuXuatService;
import com.thuongmaidientu.service.IProductService;
import com.thuongmaidientu.service.IThongKeService;
import com.thuongmaidientu.service.IThongTinGiaoHangService;

@RestController(value = "HomepageApiOfAdmin")
@RequestMapping("/quan-tri/thong-ke")
public class HomepageAdminAPI {
	@Autowired
	private IPhieuXuatService phieuXuatService;

	@Autowired
	private IPhieuNhapService phieuNhapService;

	@Autowired
	private IKhachHangService khachHangService;

	@Autowired
	private IProductService productService;

	@Autowired
	private IChiTietPXService chiTietPXService;

	@Autowired
	private IDiscountService discountService;

	@Autowired
	private IThongTinGiaoHangService thongTinGiaoHangService;

	@Autowired
	private IThongKeService thongKeService;

	@GetMapping("/orders")
	public ResponseEntity<?> getOrders() {
		try {

			List<PhieuXuatDTO> phieuXuatDTOs = phieuXuatService.getOrdersForStatiscal();
			List<PaymentStatisticalDTO> paymentStatisticalDTOs = new ArrayList<PaymentStatisticalDTO>();

			if (phieuXuatDTOs != null) {
				for (PhieuXuatDTO dto : phieuXuatDTOs) {
					String status;
					if (dto.getStatus() == 4) {
						status = "success";
					} else if (dto.getStatus() == -1 || dto.getStatus() == -3) {
						status = "cancel";
					} else {
						status = "pending";
					}

					PaymentStatisticalDTO paymentStatisticalDTO = new PaymentStatisticalDTO();

					paymentStatisticalDTO.setId(dto.getId().intValue());
					paymentStatisticalDTO.setName(khachHangService.findById(dto.getMakh()).getHoTen());
					paymentStatisticalDTO.setTotal(formatCurrency(dto.getTongTien().doubleValue()));
					paymentStatisticalDTO.setDate(dto.getThoiGian().toString());
					paymentStatisticalDTO.setStatus(status);

					paymentStatisticalDTO.setHistory(phieuXuatService.getHistoryPayemnt(dto.getMakh()));

					paymentStatisticalDTOs.add(paymentStatisticalDTO);
				}
			}

			return ResponseEntity.ok(paymentStatisticalDTOs);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi lấy dữ liệu");
		}
	}

	public String formatCurrency(double amount) {
		Locale localeVN = new Locale("vi", "VN");
		NumberFormat currencyFormatter = NumberFormat.getCurrencyInstance(localeVN);
		return currencyFormatter.format(amount);
	}

	@GetMapping("/order")
	public ResponseEntity<?> getDetailOrder(@RequestParam("id") Integer orderId) {
		try {
			PhieuXuatDTO phieuXuatDTO = phieuXuatService.findById(orderId);
			if (phieuXuatDTO == null) {
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Không tìm thấy dữ liệu");
			}

			KhachHangDTO khachHangDTO = khachHangService.findById(phieuXuatDTO.getIDKhachHang());

			phieuXuatDTO.setKhachHangName(khachHangDTO.getHoTen());
			phieuXuatDTO.setSdt(khachHangDTO.getSoDienThoai());

			ThongTinGiaoHangDTO thongTinGiaoHangDTO = thongTinGiaoHangService.findById(phieuXuatDTO.getCartShipping());

			phieuXuatDTO.setName(thongTinGiaoHangDTO.getHoVaTen());
			phieuXuatDTO.setPhone(thongTinGiaoHangDTO.getSoDienThoai());
			phieuXuatDTO.setAddress(thongTinGiaoHangDTO.getStreetName() + " " + thongTinGiaoHangDTO.getDistrict() + " "
					+ thongTinGiaoHangDTO.getCountry());

			List<ChiTietPhieuXuatDTO> chiTietPhieuXuatDTOs = chiTietPXService
					.getListCTPX(phieuXuatDTO.getId().intValue());

			AtomicInteger totalQuantity = new AtomicInteger(0);

			chiTietPhieuXuatDTOs.forEach(ctpx -> {
				ProductDTO productDTO = productService.findInfoProductForOrderInWeb(ctpx.getPhienBanSanPhamXuatId());

				ctpx.setTenSP(productDTO.getTenSanPham());
				ctpx.setRam(productDTO.getKichThuocRam());
				ctpx.setRom(productDTO.getKichThuocRom());
				ctpx.setColor(productDTO.getColor());

				// Cộng tổng
				totalQuantity.addAndGet(ctpx.getSoLuong());
			});

			phieuXuatDTO.setTotalQuantity(totalQuantity.get());
			phieuXuatDTO.setListctpx(chiTietPhieuXuatDTOs);

			if (phieuXuatDTO.getDiscountCode() != null) {

				DiscountDTO discountDTO = discountService.findById(phieuXuatDTO.getDiscountCode());

				phieuXuatDTO.setAmountDiscount(discountDTO.getDiscountAmount());
				phieuXuatDTO.setDiscountCodeRaw(discountDTO.getCode());
			}

			return ResponseEntity.ok(phieuXuatDTO);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi lấy dữ liệu");
		}
	}

	@GetMapping("/mock-data")
	public ResponseEntity<?> mockData(@RequestParam("timeFilter") String timeFilter) {
		try {

			ThongkeDTO thongkeDTO = new ThongkeDTO();

			thongkeDTO.setRevenue(phieuXuatService.getRevenueStatisticalByTimeFilter(timeFilter));
			thongkeDTO.setOrders(phieuXuatService.getOrderStatisticalByTimeFilter(timeFilter, null));
			thongkeDTO.setExportData(phieuXuatService.getRevenueStatisticalByTimeFilter(timeFilter));
			thongkeDTO.setImportData(phieuNhapService.getImportFinancingStatisticalByTimeFilter(timeFilter));

			List<Pair<String, Integer>> pairTopSellingList = phieuXuatService.getTopSellingByTimeFilter(timeFilter);

			List<String> nameProductTopList = new ArrayList<String>();
			List<Integer> valueSoldTopList = new ArrayList<Integer>();

			if (pairTopSellingList != null) {
				pairTopSellingList.forEach(pair -> {
					String name = pair.getFirst();
					Integer value = pair.getSecond();

					System.out.println("Product: " + name + ", Sold: " + value);
					nameProductTopList.add(name);
					valueSoldTopList.add(value);

				});
			}

			thongkeDTO.setTopProducts(nameProductTopList);
			thongkeDTO.setTopValues(valueSoldTopList);

			List<Integer> successCountOrder = phieuXuatService.getOrderStatisticalByTimeFilter(timeFilter, 4);
			Integer countOrderSucces = sumList(successCountOrder);

			List<Integer> deliveringCountOrder = phieuXuatService.getOrderStatisticalByTimeFilter(timeFilter, 3);
			Integer countOrderIsDelivering = sumList(deliveringCountOrder);

			List<Integer> handleCountOrderStatus0 = phieuXuatService.getOrderStatisticalByTimeFilter(timeFilter, 0);
			List<Integer> handleCountOrderStatus1 = phieuXuatService.getOrderStatisticalByTimeFilter(timeFilter, 1);
			List<Integer> handleCountOrderStatus2 = phieuXuatService.getOrderStatisticalByTimeFilter(timeFilter, 2);
			List<Integer> handleCountOrderStatus_2 = phieuXuatService.getOrderStatisticalByTimeFilter(timeFilter, -2);

			// Tính tổng cho từng trạng thái đơn hàng đang xử lý
			Integer countOrderIsHandling0 = sumList(handleCountOrderStatus0);
			Integer countOrderIsHandling1 = sumList(handleCountOrderStatus1);
			Integer countOrderIsHandling2 = sumList(handleCountOrderStatus2);
			Integer countOrderIsHandling_2 = sumList(handleCountOrderStatus_2);

			Integer countOrderHandlingTotal = countOrderIsHandling0 + countOrderIsHandling1 + countOrderIsHandling2
					+ countOrderIsHandling_2;

			List<Integer> cancleCountOrderStatusByStaff = phieuXuatService.getOrderStatisticalByTimeFilter(timeFilter,
					-1);
			List<Integer> cancleCountOrderStatusByClient = phieuXuatService.getOrderStatisticalByTimeFilter(timeFilter,
					-3);

			// Tính tổng cho từng loại đơn hàng đã hủy
			Integer countOrderCancelByStaff = sumList(cancleCountOrderStatusByStaff);
			Integer countOrderCancelByClient = sumList(cancleCountOrderStatusByClient);

			Integer countOrderCancelTotal = countOrderCancelByClient + countOrderCancelByStaff;

			if (timeFilter.equals("quarter")) {
				countOrderSucces = phieuXuatService.getStatusOrderFollowDoughnutChart(4);

				countOrderIsDelivering = phieuXuatService.getStatusOrderFollowDoughnutChart(3);

				countOrderIsHandling0 = phieuXuatService.getStatusOrderFollowDoughnutChart(0);
				countOrderIsHandling1 = phieuXuatService.getStatusOrderFollowDoughnutChart(1);
				countOrderIsHandling2 = phieuXuatService.getStatusOrderFollowDoughnutChart(2);
				countOrderIsHandling_2 = phieuXuatService.getStatusOrderFollowDoughnutChart(-2);

				countOrderHandlingTotal = countOrderIsHandling0 + countOrderIsHandling1 + countOrderIsHandling2
						+ countOrderIsHandling_2;

				countOrderCancelByStaff = phieuXuatService.getStatusOrderFollowDoughnutChart(-1);
				countOrderCancelByClient = phieuXuatService.getStatusOrderFollowDoughnutChart(-3);

				countOrderCancelTotal = countOrderCancelByClient + countOrderCancelByStaff;
			}

			thongkeDTO.setStatusData(
					List.of(countOrderSucces, countOrderHandlingTotal, countOrderIsDelivering, countOrderCancelTotal));

			thongkeDTO.setQuantityPurchase(countOrderSucces);
			thongkeDTO.setQuantityUser(khachHangService.getQuantityRegisterByTimeFilter(timeFilter));

			return ResponseEntity.ok(thongkeDTO);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi lấy dữ liệu");
		}
	}

	private int sumList(List<Integer> list) {
		if (list == null || list.isEmpty()) {
			return 0;
		}

		return list.stream().mapToInt(Integer::intValue).sum();
	}

	@GetMapping
	public ResponseEntity<?> getInfoGeneral() {
		try {

			ThongkeDTO thongkeDTO = new ThongkeDTO();
			thongkeDTO.setQuantityProduct(thongKeService.getCountProduct());
			thongkeDTO.setQuantityPurchase(thongKeService.getCountPurchase());
			thongkeDTO.setQuantityUser(thongKeService.getCountUser());
			thongkeDTO.setQuantityWareHouse(thongKeService.getCountWareHouse());

			return ResponseEntity.ok(thongkeDTO);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi xóa sản phẩm");
		}
	}

	@GetMapping("/don-hang/week")
	public ResponseEntity<?> getOrderByWeek() {
		try {
			return ResponseEntity.ok(phieuXuatService.getStatisticalFollowWeek());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi xóa sản phẩm");
		}
	}

	@GetMapping("/don-hang/month")
	public ResponseEntity<?> getOrderByMonth() {
		try {
			return ResponseEntity.ok(phieuXuatService.getStatisticalFollowMonth());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi xóa sản phẩm");
		}
	}

	@GetMapping("/doanh-thu/week")
	public ResponseEntity<?> getDoanhThuByWeek() {
		try {
			return ResponseEntity.ok(phieuXuatService.getStatisticalDoanhThuFollowWeek());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi xóa sản phẩm");
		}
	}

	@GetMapping("/doanh-thu/month")
	public ResponseEntity<?> getDoanhThuByMonth() {
		try {
			return ResponseEntity.ok(phieuXuatService.getStatisticalDoanhThuFollowMonth());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi xóa sản phẩm");
		}
	}

	@GetMapping("/san-pham/top")
	public ResponseEntity<?> getProductSelling() {
		try {
			return ResponseEntity.ok(productService.getTopSellingProduct());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi xóa sản phẩm");
		}
	}

	@GetMapping("/nhap-xuat/year")
	public ResponseEntity<?> getNhapXuatByYear() {
		try {
			return ResponseEntity.ok(phieuXuatService.getPnPxByMonth());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi xóa sản phẩm");
		}
	}

	@GetMapping("/nhap-xuat/quarter")
	public ResponseEntity<?> getNhapXuatByQuarter() {
		try {
			return ResponseEntity.ok(phieuXuatService.getPnPxByQuarter());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi xóa sản phẩm" + e);
		}
	}
}
