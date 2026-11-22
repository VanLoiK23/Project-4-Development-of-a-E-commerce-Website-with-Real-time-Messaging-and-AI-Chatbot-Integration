<%@page import="com.thuongmaidientu.dto.PaymentStatisticalDTO"%>
<%@include file="/common/taglib.jsp"%>
<%@ page import="java.util.*"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<c:url var="APIurl" value="/api-admin-new" />
<c:url var="NewURL" value="/admin-new" />
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>

<head>

<meta name="stylesheet"
	content='
	 <link rel="stylesheet"
			href="<c:url value='/template/css/style/order_details.css' />" />
	    ' />

<meta name="scripts"
	content='
	<script src="https://code.jquery.com/jquery-3.7.1.js"></script>
	<script
		src="<c:url value='/template/admin/assets/js/jquery-ui.min.js'/>"></script>
	<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
	    ' />

</head>
<body>

	<div class="main-content">
		<section id="wrapper">
		<div class="p-4">

			<div class="welcome mb-4">
				<div
					class="content rounded-3 p-3 bg-light d-flex justify-content-between align-items-center shadow-sm"
					style="height: 100px !important">
					<div>
						<h1 class="fs-4 text-primary fw-bold">Dashboard Quản Trị</h1>
						<p class="mb-0 text-muted">Xin chào, Gia Huy!</p>
					</div>
					<div class="d-flex gap-2">
						<select id="timeSlicer"
							class="form-select form-select-sm shadow-sm"
							onchange="updateDashboard()">
							<option value="week">7 ngày qua</option>
							<option value="month" selected>Tháng này</option>
							<option value="quarter">Quý này</option>
							<option value="year">Năm nay</option>
						</select>
						<button style="white-space: nowrap"
							class="btn btn-sm btn-primary shadow-sm"
							onclick="updateDashboard()">
							<i class="fa fa-sync-alt"></i> Cập nhật
						</button>
					</div>
				</div>
			</div>

			<section class="statis mt-4 text-center">
			<div class="row">
				<div class="col-md-6 col-lg-3 mb-4 mb-lg-0">
					<div class="box bg-primary p-3">
						<i class="fa-solid fa-warehouse"></i>
						<h3>${dto.quantityWareHouse}</h3>
						<p class="lead">Kho hoạt động</p>
					</div>
				</div>
				<div class="col-md-6 col-lg-3 mb-4 mb-lg-0">
					<div class="box bg-danger p-3">
						<i class="uil-user"></i>
						<h3 id="quantityRegister">${dto.quantityUser}</h3>
						<p class="lead">Khách hàng mới</p>
					</div>
				</div>
				<div class="col-md-6 col-lg-3 mb-4 mb-md-0">
					<div class="box bg-warning p-3">
						<i class="uil-shopping-cart"></i>
						<h3>${dto.quantityProduct}</h3>
						<p class="lead">Sản phẩm</p>
					</div>
				</div>
				<div class="col-md-6 col-lg-3">
					<div class="box bg-success p-3">
						<i class="uil-feedback"></i>
						<h3 id="quantityPurchase">${dto.quantityPurchase}</h3>
						<p class="lead">Đơn thành công</p>
					</div>
				</div>
			</div>
			</section>

			<section class="charts mt-4">
			<div class="row g-4">
				<div class="col-lg-8">
					<div class="chart-container bg-black rounded-3 shadow-sm p-4 h-100">
						<div
							class="d-flex justify-content-between align-items-center mb-3">
							<h3 class="fs-6 fw-bold text-secondary">📈 Xu hướng Doanh
								thu & Đơn hàng</h3>
							<small class="text-muted" id="chartLabel">Tháng này</small>
						</div>
						<div style="height: 300px; position: relative;">
							<canvas id="revenueTrendChart"></canvas>
						</div>
					</div>
				</div>

				<div class="col-lg-4">
					<div class="chart-container bg-black rounded-3 shadow-sm p-4 h-100">
						<h3 class="fs-6 fw-bold text-secondary mb-3">📦 Trạng thái
							Đơn hàng</h3>
						<div
							style="height: 250px; position: relative; display: flex; justify-content: center;">
							<canvas id="orderStatusChart"></canvas>
						</div>
					</div>
				</div>
			</div>
			</section>

			<section class="charts mt-4 mb-5">
			<div class="row g-4">
				<div class="col-lg-6">
					<div class="chart-container bg-black rounded-3 shadow-sm p-4 h-100">
						<h3 class="fs-6 fw-bold text-secondary mb-3">🏆 Top 5 Sản
							phẩm Bán chạy</h3>
						<div style="height: 250px;">
							<canvas id="topProductChart"></canvas>
						</div>
					</div>
				</div>

				<div class="col-lg-6">
					<div class="chart-container bg-black rounded-3 shadow-sm p-4 h-100">
						<h3 class="fs-6 fw-bold text-secondary mb-3">🔄 Thống kê
							Nhập/Xuất Kho</h3>
						<div style="height: 250px;">
							<canvas id="importExportChart"></canvas>
						</div>
					</div>
				</div>
			</div>
			</section>


			<section class="orders mt-4 mb-5">
			<div class="card shadow-sm border-0">
				<div
					class="card-header bg-white py-3 d-flex flex-wrap justify-content-between align-items-center">
					<h5 class="m-0 font-weight-bold text-primary">
						<i class="fa-solid fa-list-ul"></i> Đơn hàng gần đây
					</h5>

					<div class="d-flex align-items-center gap-2">
						<select id="tableStatusFilter" class="form-select form-select-sm"
							onchange="fetchAndRenderOrders()">
							<option value="all">Tất cả trạng thái</option>
							<option value="success">Thành công</option>
							<option value="pending">Đang xử lý</option>
							<option value="cancel">Đã hủy</option>
						</select>
					</div>
				</div>

				<div class="card-body p-0">
					<div class="table-responsive">
						<table class="table table-hover align-middle mb-0">
							<thead class="bg-light text-secondary">
								<tr>
									<th class="ps-4">Mã đơn</th>
									<th>Khách hàng</th>
									<th>Ngày đặt</th>
									<th>Tổng tiền</th>
									<th style="width: 120px;">Lịch sử mua</th>
									<th>Trạng thái</th>
									<th class="text-end pe-4">Hành động</th>
								</tr>
							</thead>
							<tbody id="orderTableBody">
								<tr>
									<td colspan="7" class="text-center py-4">Đang tải dữ
										liệu...</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
			</section>
		</div>
		</section>
		<%@ include file="chitietdonhang.jsp"%>
	</div>


	<script>

	let globalOrderData = []; 

	function fetchAndRenderOrders() {
	    const filter = document.getElementById('tableStatusFilter').value;
	    
	    if (globalOrderData.length > 0) {
	        applyFilterAndRender(filter);
	        return;
	    }

	    $.ajax({
	        url: "http://localhost:8080/Spring-mvc/quan-tri/thong-ke/orders",
	        method: "GET",
	        dataType: "json",
	        success: function(response) {
	            console.log("Dữ liệu nhận được:", response);

	            globalOrderData = response;
	            
	            applyFilterAndRender(filter);
	        },
	        error: function(xhr, status, error) {
	            console.error("Lỗi khi lấy dữ liệu: ", error);

	            document.getElementById("orderTableBody").innerHTML = `<tr><td colspan="7" class="text-center text-danger">Lỗi kết nối server!</td></tr>`;
	        }
	    });
	}

	function applyFilterAndRender(filterStatus) {
	    let filteredData = globalOrderData;

	    if (filterStatus !== 'all') {
	        filteredData = globalOrderData.filter(item => {
	            return item.status && item.status.toLowerCase() === filterStatus.toLowerCase();
	        });
	    }

	    renderTable(filteredData);
	}

	function renderTable(orders) {
		const tbody = document.getElementById("orderTableBody");
		tbody.innerHTML = ""; 

		if (orders.length === 0) {
			tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">Không có dữ liệu đơn hàng.</td></tr>`;
			return;
		}

		orders.forEach(order => {
			// Tạo màu badge theo status
			let badgeClass = "bg-secondary";
			let statusText = "Không rõ";
			if (order.status === 'success') { badgeClass = "bg-success"; statusText = "Thành công"; }
			if (order.status === 'pending') { badgeClass = "bg-warning text-dark"; statusText = "Đang xử lý"; }
			if (order.status === 'cancel') { badgeClass = "bg-danger"; statusText = "Đã hủy"; }

			// TẠO SPARKLINE SVG TỪ DỮ LIỆU HISTORY
			const sparklineHTML = createSparklineSVG(order.history, order.status);

			const row = `
			            <tr>
			                <!-- THÊM DẤU \ TRƯỚC DẤU $ -->
			                <td class="ps-4 fw-bold">#\${order.id}</td> 
			                <td>
			                    <div class="d-flex align-items-center">
			                        <div class="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-2" style="width:30px; height:30px; font-size:12px">
			                            \${order.name.charAt(0)}
			                        </div>
			                        <span>\${order.name}</span>
			                    </div>
			                </td>
			                <td>\${order.date}</td>
			                <td class="fw-bold">\${order.total}</td>
			                
			                <td>\${sparklineHTML}</td> <!-- Cái này là biến JS đã tính toán, cũng phải escape -->
			                
			                <td><span class="badge \${badgeClass} bg-opacity-75 rounded-pill px-3">\${statusText}</span></td>
			                <td class="text-end pe-4">
			                    <button class="btn btn-sm btn-outline-primary" onclick="viewOrderDetail(\${order.id})"><i class="fa fa-eye"></i></button>
			                </td>
			            </tr>
			        `;
			tbody.innerHTML += row;
		});
	}

	// 3. --- CÔNG THỨC VẼ SPARKLINE (SVG) ---
	function createSparklineSVG(dataArray, status) {
		if (!dataArray || dataArray.length === 0) return "<span class='text-muted small'>Chưa có lịch sử</span>";

		const width = 100;  // Chiều rộng ảnh SVG
		const height = 30;  // Chiều cao ảnh SVG
		const maxVal = Math.max(...dataArray);
		const minVal = Math.min(...dataArray);

		// Màu sắc đường kẻ tùy theo trạng thái đơn hàng cho đẹp
		let strokeColor = "#4e73df"; // Mặc định xanh dương
		if (status === 'success') strokeColor = "#1cc88a"; // Xanh lá
		if (status === 'cancel') strokeColor = "#e74a3b"; // Đỏ

		// Tính toán tọa độ các điểm (Points)
		// Công thức: x = (index / (tổng số điểm - 1)) * chiều rộng
		//             y = chiều cao - ((giá trị / giá trị lớn nhất) * chiều cao)

		let points = "";
		dataArray.forEach((val, index) => {
			const x = (index / (dataArray.length - 1)) * width;
			// Tránh chia cho 0 nếu maxVal = 0
			const normalizedVal = maxVal === 0 ? 0 : val;
			const y = height - ((normalizedVal / (maxVal || 1)) * height);
			points += `\${x},\${y} `;
		});

		// Trả về mã HTML SVG
		return `
			        <svg width="\${width}" height="\${height}" overflow="visible">
			            <polyline points="\${points}" 
			                      fill="none" 
			                      stroke="\${strokeColor}" 
			                      stroke-width="2" 
			                      stroke-linecap="round" 
			                      stroke-linejoin="round"/>
			            
			            <circle cx="\${width}" cy="\${height - ((dataArray[dataArray.length-1] / (maxVal || 1)) * height)}" 
			                    r="3" fill="\${strokeColor}" />
			        </svg>
			    `;
	}


	function formatMoney(amount) {
	    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
	}

	// 1. Hàm gọi API và mở Popup
	async function viewOrderDetail(orderId) {
	    try {
		    console.log()
		    
	        openOrderPopup();
	        
	        const response = await fetch('http://localhost:8080/Spring-mvc/quan-tri/thong-ke/order?id=' + orderId);
	        const data = await response.json();
	        	        
	        document.getElementById('detail_orderCode').innerText = `#\${data.id}`;
	        document.getElementById('detail_orderDate').innerText = formatDateTime(data.thoiGian);	        
	        renderStatus(data.status);

	        document.getElementById('detail_customerName').innerText = data.khachHangName;
	        document.getElementById('detail_customerPhone').innerText = data.sdt;
	        
	        document.getElementById('detail_shipName').innerText = data.name;
	        document.getElementById('detail_shipPhone').innerText = data.phone;
	        document.getElementById('detail_shipAddress').innerText = data.address;

	        const listArea = document.getElementById('detail_productListArea');
	        listArea.innerHTML = ""; 
	        
	        data.listctpx.forEach(item => {
	            
	            let romInfo = "";
	            if (item.rom) {
	                romInfo = " - " + item.ram + "GB / " + item.rom + "GB";
	            }

	            const itemHTML = `
	                <div class="frame-19516" style="height:50px">
	                    <div class="table-content-1">
	                        <p class="th-ng-24-chai-tr-long-vcha-1">
	                            \${item.tenSP} 
	                            \${romInfo}
	                            - \${item.color}
	                        </p>
	                    </div>
	                    
	                    <div class="content-text-1-line-3">
	                        <div class="frame-593"><p class="content-left-4">\${item.soLuong}</p></div>
	                    </div>
	                    
	                    <div class="content-text-1-line-4">
	                        <div class="frame-594"><p class="content-left-5" style="white-space: nowrap">\${formatMoney(item.donGia)}</p></div>
	                    </div>
	                    
	                    <div class="content-text-1-line-5">
	                        <div class="frame-595"><p class="content-left-6">\${formatMoney(item.donGia * item.soLuong)}</p></div>
	                    </div>
	                </div>
	            `;
	            listArea.innerHTML += itemHTML;
	        });

	        let paymentMethod;
	        let payment=data.payment;
	        if(payment==='momo'||payment==='vn-pay'){
		        paymentMethod=payment;
		        document.getElementById('detail_total').innerText = formatMoney(data.tongTien);
		    }else if(payment==='pending'){
		    	paymentMethod="Đang chờ thanh toán";
		        document.getElementById('detail_total').innerText = "...";
			 }else{
				paymentMethod="Tiền mặt COD";
		        document.getElementById('detail_total').innerText = formatMoney(data.tongTien);
			}
	       
	        
	        document.getElementById('detail_payment').innerText = paymentMethod;

		    let transportFee= data.feeTransport > 0 ? 200000 : 0;
		    let amountDiscount= data.amountDiscount;
		    let subTotal=data.tongTien-transportFee+amountDiscount;
		    
	        
	        document.getElementById('detail_subTotal').innerText = formatMoney(subTotal);
	        document.getElementById('detail_shippingFee').innerText = transportFee > 0 ? formatMoney(transportFee) : "Miễn phí";
	        document.getElementById('detail_discountRaw').innerText = amountDiscount > 0 ? data.discountCodeRaw : "Không";
	        document.getElementById('detail_discount').innerText = amountDiscount > 0 ? "- "+formatMoney(amountDiscount) : 0;
	        document.getElementById('detail_finalTotal').innerText = formatMoney(data.tongTien);

	        const payText = document.getElementById('detail_paymentStatus');
	        if (data.payment === 'momo'||data.payment === 'vn-pay') payText.innerText = "Đã thanh toán";
	        else if (data.payment === 'pending') payText.innerText = "Chờ thanh toán";
	        else payText.innerText = "Thanh toán khi nhận hàng";

	        let quantityTotal =data.totalQuantity;
	        
	        document.getElementById('detail_paymentQuantity').innerText ="( "+quantityTotal+" sản phẩm)";
	        document.getElementById('detail_finalTotalGrand').innerText = formatMoney(data.tongTien);
	    } catch (error) {
	        console.error("Lỗi tải đơn hàng:", error);
	        alert("Không thể tải chi tiết đơn hàng.");
	        closeOrderPopupDirect();
	    }
	}

	// Hàm render trạng thái 
	function renderStatus(status) {
	    const bgDiv = document.getElementById('detail_statusBg');
	    const textP = document.getElementById('detail_statusText');
	    
	    let color = "#6c757d"; 
	    let text = "Không xác định";

	    if (status == 0) { color = "#f0ad4e"; text = "Đang chờ duyệt"; }
	    else if (status == 1) { color = "#5bc0de"; text = "Đang chờ lấy hàng"; }
	    else if (status == 2) { color = "#5bc0de"; text = "Đang lấy hàng"; }
	    else if (status == 3) { color = "#36b9cc"; text = "Đang giao hàng"; }
	    else if (status == 4) { color = "rgba(48, 205, 96, 1)"; text = "Đã giao"; }
	    else if (status == -2) { color = "gray"; text = "Khách hàng gửi đơn hủy"; }
	    else if (status == -1||status == -3) { color = "#d9534f"; text = "Đã hủy"; }

	    bgDiv.style.backgroundColor = color;
	    bgDiv.style.color = "#fff";
	    textP.innerText = text;
	}


	function formatMoney(amount) {
	    if (!amount) return "0 đ";
	    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
	}

	function formatDateTime(timestamp) {
	    if (!timestamp) return "";
	    
	    const date = new Date(timestamp);
	    
	    return new Intl.DateTimeFormat('vi-VN', {
	        year: 'numeric',
	        month: '2-digit',
	        day: '2-digit',
	        hour: '2-digit',
	        minute: '2-digit',
	        second: '2-digit',
	        hour12: false 
	    }).format(date);
	}
	</script>

	<script src="<c:url value='/template/js/admin-home2.js'/>"></script>

</body>
</html>