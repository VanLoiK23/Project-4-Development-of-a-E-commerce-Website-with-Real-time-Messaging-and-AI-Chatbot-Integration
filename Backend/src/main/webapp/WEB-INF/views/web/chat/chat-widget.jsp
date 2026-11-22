<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@include file="/common/taglib.jsp"%>

<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>

<button class="chat-icon" id="chatToggle">
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path
			d="M12 3C6.48 3 2 6.94 2 12c0 2.5 1.09 4.77 2.88 6.5L4 21l3.04-.83C8.01 21.45 9.95 22 12 22c5.52 0 10-3.94 10-9s-4.48-10-10-10zm0 17c-1.77 0-3.41-.46-4.83-1.26l-.35-.2-.72.2.38-1.22-.89-.88C4.13 15.25 3.5 13.67 3.5 12 3.5 7.86 7.36 4.5 12 4.5S20.5 7.86 20.5 12 16.64 20 12 20z" />
    </svg>
</button>

<div class="chat-container" id="chatBox" style="display: none;">

	<div class="chat-header">
		<span id="chatTitle">💬 Hỗ trợ khách hàng</span>
		<div style="margin-left: auto;">
			<span class="back-btn" id="chatBack"
				style="display: none; cursor: pointer; margin-right: 230px; margin-top: 70px;">↩
				Quay lại</span> <span class="close-btn" id="chatClose"
				style="cursor: pointer;">&times;</span>
		</div>
	</div>

	<div class="chat-options" id="chatOptions">
		<p style="text-align: center; margin-bottom: 20px; color: #555;">Chào
			bạn! Bạn muốn hỗ trợ vấn đề gì?</p>

		<div class="option-card" onclick="selectMode('AI')">
			<div class="icon">🤖</div>
			<div class="text">
				<strong>Trợ lý AI (24/7)</strong> <small>Tư vấn sản phẩm,
					tra cứu giá, đặt hàng tự động</small>
			</div>
		</div>

		<div class="option-card" onclick="selectMode('ADMIN')">
			<div class="icon">👨‍💼</div>
			<div class="text">
				<strong>Nhân viên tư vấn</strong> <small>Hỗ trợ kỹ thuật,
					khiếu nại, vấn đề phức tạp</small>
			</div>
		</div>
	</div>

	<div class="chat-main" id="chatMain" style="display: none;">
		<div class="chat-messages" id="chatMessages"></div>

		<div class="chat-input">
			<input type="file" id="imageInput" accept="image/*"
				style="display: none;" onchange="handleImageSelect()">

			<button id="btnImage" class="btn-icon" style="display: none;"
				onclick="document.getElementById('imageInput').click()">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
					viewBox="0 0 24 24" fill="none" stroke="currentColor"
					stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path
						d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                    <circle cx="12" cy="13" r="4"></circle>
                </svg>
			</button>

			<input type="text" id="messageInput" placeholder="Nhập tin nhắn..." />

			<button id="sendMessage">Gửi</button>
		</div>
	</div>
</div>

<div id="imageModal" class="image-modal" onclick="closeImageModal()">
    <span class="close-modal">&times;</span>
    <img class="modal-content" id="fullImage">
</div>

<c:if test="${not empty sessionScope.user}">
	<script>
		const currentUser = {
			id : "${sessionScope.user.id}",
			name : "${sessionScope.name}"
		};

		console.log("Current user:", currentUser);
	</script>
</c:if>