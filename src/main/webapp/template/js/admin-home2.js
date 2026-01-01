//global variable
let revenueChart = null;
let statusChart = null;
let topProductChart = null;
let importExportChart = null;
let mockData = null;

document.addEventListener("DOMContentLoaded", function() {
	// Gọi mặc định khi vào trang (Lọc theo tháng)
	updateDashboard();

	// Gọi hàm render bảng đơn hàng (đã có từ trước)
	if (typeof fetchAndRenderOrders === "function") {
		fetchAndRenderOrders();
	}
});


function parseCurrency(str) {
	if (!str) return 0;
	const numberStr = str.toString().replace(/[^0-9]/g, '');
	return parseInt(numberStr) || 0;
}

// --- HÀM CẬP NHẬT DASHBOARD ---
function updateDashboard() {
	const timeSlicer = document.getElementById('timeSlicer');
	const timeRange = timeSlicer ? timeSlicer.value : 'month'; // Mặc định month nếu ko tìm thấy slicer

	// Cập nhật text hiển thị
	const labelSpan = document.getElementById('chartLabel');
	const quantityRegister = document.getElementById('quantityRegister');
	const quantityPurchase = document.getElementById('quantityPurchase');

	if (labelSpan && timeSlicer) {
		labelSpan.innerText = timeSlicer.options[timeSlicer.selectedIndex].text;
	}

	let labels = [];
	if (timeRange === 'week') {
		labels = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
	} else if (timeRange === 'month') {
		labels = ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4", "Tuần 5"];
	} else if (timeRange === 'quarter') {
		labels = ["Quý 1", "Quý 2", "Quý 3", "Quý 4"];
	} else {
		labels = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"];
	}

	//AJAX 
	$.ajax({
		url: "http://localhost:8080/Spring-mvc/quan-tri/thong-ke/mock-data",
		method: "GET",
		data: { timeFilter: timeRange },
		dataType: "json",
		success: function(response) {
			console.log("Dữ liệu nhận được:", response);

			quantityRegister.innerText = response.quantityUser
			quantityPurchase.innerText = response.quantityPurchase

			const processedData = {
				labels: labels,

				revenue: response.revenue.map(parseCurrency),
				importData: response.importData.map(parseCurrency),
				exportData: response.exportData.map(parseCurrency),

				orders: response.orders,
				statusData: response.statusData,

				topProducts: response.topProducts,
				topValues: response.topValues
			};

			//VẼ BIỂU ĐỒ
			initCharts(processedData);
		},
		error: function(xhr, status, error) {
			console.error("Lỗi khi lấy dữ liệu: ", error);
			alert("Không thể tải dữ liệu thống kê.");
		}
	});
}

function initCharts(data) {

	// 1. Biểu đồ Đường (Doanh thu & Đơn hàng)
	const ctxRevenue = document.getElementById('revenueTrendChart')
		.getContext('2d');


	if (revenueChart) {
		revenueChart.destroy();
	}
	if (statusChart) {
		statusChart.destroy();
	}
	if (topProductChart) {
		topProductChart.destroy();
	}
	if (importExportChart) {
		importExportChart.destroy();
	}

	revenueChart = new Chart(ctxRevenue, {
		type: 'line',
		data: {
			labels: data.labels,
			datasets: [{
				label: 'Doanh thu (Triệu VNĐ)',
				data: data.revenue,
				borderColor: '#4e73df', // Xanh dương
				backgroundColor: 'rgba(78, 115, 223, 0.05)',
				tension: 0.3, // Đường cong mềm mại
				fill: true,
				yAxisID: 'y'
			}, {
				label: 'Số đơn hàng',
				data: data.orders,
				borderColor: '#1cc88a', // Xanh lá
				backgroundColor: 'transparent',
				borderDash: [5, 5], // Nét đứt
				tension: 0.3,
				yAxisID: 'y1'
			}]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			scales: {
				y: {
					position: 'left',
					beginAtZero: true
				},
				y1: {
					position: 'right',
					beginAtZero: true,
					grid: {
						drawOnChartArea: false
					}
				}
			}
		}
	});

	// 2. Biểu đồ Tròn (Trạng thái đơn)
	const ctxStatus = document.getElementById('orderStatusChart')
		.getContext('2d');
	statusChart = new Chart(ctxStatus,
		{
			type: 'doughnut',
			data: {
				labels: ["Thành công", "Đang xử lý", "Đang giao",
					"Hủy"],
				datasets: [{
					data: data.statusData,
					backgroundColor: ['#1cc88a', '#f6c23e',
						'#36b9cc', '#e74a3b'],
					hoverOffset: 4
				}]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						position: 'bottom'
					}
				}
			}
		});

	// 3. Biểu đồ Cột Ngang (Top Sản phẩm)
	const ctxTop = document.getElementById('topProductChart')
		.getContext('2d');
	topProductChart = new Chart(ctxTop, {
		type: 'bar',
		data: {
			labels: data.topProducts,
			datasets: [{
				label: 'Số lượng bán',
				data: data.topValues,
				backgroundColor: '#4e73df',
				borderRadius: 5
			}]
		},
		options: {
			indexAxis: 'y', // QUAN TRỌNG: Xoay ngang biểu đồ
			responsive: true,
			maintainAspectRatio: false
		}
	});

	// 4. Biểu đồ Cột Chồng (Nhập/Xuất)
	const ctxIO = document.getElementById('importExportChart')
		.getContext('2d');
	importExportChart = new Chart(ctxIO, {
		type: 'bar',
		data: {
			labels: data.labels,
			datasets: [{
				label: 'Nhập kho',
				data: data.importData,
				backgroundColor: '#36b9cc'
			}, {
				label: 'Xuất kho',
				data: data.exportData,
				backgroundColor: '#e74a3b'
			}]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			scales: {
				x: {
					stacked: false
				},
				y: {
					beginAtZero: true
				}
			}
			// stacked: true nếu muốn chồng lên nhau
		}
	});
}

