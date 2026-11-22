<%@include file="/common/taglib.jsp"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8" />
<title>Admin Chat</title>
<link rel="stylesheet"
	href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">

<link rel="stylesheet"
	href="<c:url value='/template/css/style/chat.css' />" />
</head>
<body>

	<div class="main-content">
		<div class="chat-container">
			<div class="sidebarChat">
				<div class="search-box">
					<div style="position: relative;">
						<span style="position: absolute; left: 5px; top: 10px">🔍 </span>
						<input type="text" id="search"
							placeholder="Tìm kiếm khách hàng...">
					</div>
				</div>
				<div class="client-list" id="clientList">
					<!-- Danh sách khách hàng sẽ render ở đây -->
				</div>
			</div>

			<div class="chat-area">
				<div class="chat-header" id="chatHeader">💬 Chưa chọn khách
					hàng</div>
				<div class="chat-messages" id="chatMessages"></div>

				<div class="chat-input">
					<input type="file" id="imageInputAdmin" accept="image/*"
						style="display: none;" onchange="handleAdminImageSelect()">

					<button class="btn-icon"
						onclick="document.getElementById('imageInputAdmin').click()"
						title="Gửi ảnh">📷</button>

					<input type="text" id="msgInput" placeholder="Nhập tin nhắn..." />
					<button id="sendBtn">Gửi</button>
				</div>
			</div>
		</div>
	</div>

	<div id="imageModal" class="image-modal" onclick="closeImageModal()">
		<span class="close-modal">&times;</span> <img class="modal-content"
			id="fullImage">
	</div>

</body>
</html>

