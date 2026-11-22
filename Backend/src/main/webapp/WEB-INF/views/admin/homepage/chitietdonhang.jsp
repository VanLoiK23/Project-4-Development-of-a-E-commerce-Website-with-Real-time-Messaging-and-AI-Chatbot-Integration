<%@include file="/common/taglib.jsp"%>
<%@ page import="java.util.*"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>

<div id="orderDetailModal" class="modal-overlay"
	onclick="closeOrderPopup(event)">

	<!-- Phần nội dung trắng -->
	<div class="popup-content">

		<!-- Nút đóng -->
		<span class="close-popup-btn" onclick="closeOrderPopupDirect()">&times;</span>
		<div class="container_order">
			<h2 class="header" id="header">Chi tiết đơn hàng</h2>

			<div class="frame-19522" id="frame-19522">
				<div class="frame-195211">
					<div class="frame-19520">
						<div class="frame-19519">
							<div class="frame-19518">
								<p class="nhng">Đơn hàng:</p>
								<p class="_-22010124125521352" id="detail_orderCode">#...</p>
							</div>
							<div class="frame-19551">
								<p class="content-left" id="detail_orderDate">...</p>
							</div>
						</div>	

						<div class="product-status" style="${statusStyleCss}" id="detail_statusBg">
							<p class="tag-content" id="detail_statusText">Loading...</p>
						</div>
					</div>
					<div class="frame-19548">
						<div class="frame-19545 clip-contents">
							<div class="frame-852">
								<p class="kh-ch-hng">KHÁCH HÀNG</p>
							</div>
							<div class="frame-849">
								<div class="frame-19498">
									<p class="nguy-nminh-ho-ng-ph-ng" id="detail_customerName">...</p>
								</div>
								<p class="_-0985123245" id="detail_customerPhone">...</p>
							</div>
						</div>
						<div class="frame-19546 clip-contents">
							<div class="frame-8521">
								<p class="ng-inh-n">NGƯỜI NHẬN</p>
							</div>
							<div class="frame-8491">
								<div class="frame-194981">
									<p class="nguy-nminh-ho-ng-ph-ng1" id="detail_shipName">...</p>
								</div>
								<p class="_-09851232451" id="detail_shipPhone">...</p>
								<p class="tng-12-tapeakview-s-36-ho" id="detail_shipAddress">...</p>
							</div>
						</div>
					</div>
					<div class="frame-19506 clip-contents">
						<div class="frame-19521">
							<div class="table-content">
								<p class="th-ng-24-chai-tr-long-vcha" style="display: none">
									Nước Mắm Sá Sùng Vân Đồn chai 700...</p>
							</div>

						</div>
						<div class="frame-19504">
							<div class="header-text">
								<p class="title-left">Tên sản phẩm</p>
							</div>
							<div class="header-text-1">
								<p class="title-left-1">Số lượng</p>
							</div>
							<div class="header-text-2">
								<p class="title-left-2">Đơn giá</p>
							</div>
							<div class="header-text-3">
								<p class="title-left-3">Tổng tiền</p>
							</div>
						</div>

						<div id="detail_productListArea"></div>

					</div>
				</div>
				<div class="frame-19538">
					<div class="frame-19549 clip-contents">
						<div class="frame-8522">
							<p class="ph-ng-th-cthanh-to-n">PHƯƠNG THỨC THANH TOÁN</p>
						</div>
						<div class="frame-660">
							<div class="frame-19542">
								<div class="frame-838">
									<p class="vnpayqr" id="detail_payment">...</p>

									<p class="_-6000000" id="detail_total">...</p>
								</div>
							</div>
						</div>
					</div>
					<div class="block-summary clip-contents">
						<div class="frame-792">
							<div class="frame-6601">
								<p class="tmtnh">Tạm tính</p>
								<p class="_-15500000" id="detail_subTotal">0 đ</p> <!-- Tạm tính -->
							</div>
							<div class="frame-662">
								<p class="ph-vnchuy-n">Phí vận chuyển</p>

								<p class="mi-nph" id="detail_shippingFee">0 đ</p> <!-- Phí ship -->
							</div>
							<div class="frame-778">
								<div class="frame-777" style="white-space: nowrap">
									<p class="mgi-mgi">Mã giảm giá</p>
									<div class="product-status-1">
										<p class="tag-content-1" id="detail_discountRaw">..</p>
									</div>
								</div>
								<p class="_-10000" style="white-space: nowrap" id="detail_discount">0 đ</p>
							</div>
							<div class="frame-794">
								<div class="frame-779">
									<p class="th-nh-ti-n">Thành tiền</p>
									<p class="_-16600000" id="detail_finalTotal">0 đ</p> <!-- Thành tiền -->
								</div>

							</div>
						</div>
						<div class="frame-404">

							<div class="frame-6602">
								<div class="frame-836">

									<p class="cnthanh-to-n" id="detail_paymentStatus" style="white-space:nowrap">...</p>
									
									<p class="_-6-sa-nph-m" id="detail_paymentQuantity">...</p>
								</div>
								<div class="frame-835">
									<p class="_-16280000" style="white-space: nowrap;" id="detail_finalTotalGrand">0 đ</p> <!-- Thành tiền -->
									<p class="abao-gmvat">(Đã bao gồm VAT)</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>


<script>
	function openOrderPopup() {
		document.getElementById('orderDetailModal').style.display = 'flex';
		document.body.style.overflow = 'hidden'; // Khóa cuộn trang web nền
	}

	// Hàm đóng Popup (khi bấm nút X)
	function closeOrderPopupDirect() {
		document.getElementById('orderDetailModal').style.display = 'none';
		document.body.style.overflow = 'auto'; // Mở lại cuộn
	}

	// Hàm đóng Popup (khi bấm ra vùng đen bên ngoài)
	function closeOrderPopup(event) {
		if (event.target.id === 'orderDetailModal') {
			closeOrderPopupDirect();
		}
	}
</script>