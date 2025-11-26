const chatToggle = document.getElementById("chatToggle");
const chatBox = document.getElementById("chatBox");
const chatClose = document.getElementById("chatClose");
const chatBack = document.getElementById("chatBack"); // Nút quay lại
const chatMessages = document.getElementById("chatMessages");
const messageInput = document.getElementById("messageInput");
const sendMessageBtn = document.getElementById("sendMessage");

const myUserId = (typeof currentUser !== 'undefined' && currentUser.id) ? currentUser.id : "guest_" + new Date().getTime();
const myUserName = (typeof currentUser !== 'undefined' && currentUser.name) ? currentUser.name : "Khách";

let currentMode = null; // 'AI' hoặc 'ADMIN'
const aiSessionId = "session_" + new Date().getTime(); // Session riêng cho AI
let socket = null; // Biến lưu kết nối WebSocket

const chatHistoryStorage = {
	'AI': '',
	'ADMIN': ''
};

// Biến cờ để kiểm tra xem mode này đã được chào lần đầu chưa
const hasWelcomed = {
	'AI': false,
	'ADMIN': false
};

document.addEventListener("DOMContentLoaded", function() {
	if (myUserId) {
		console.log("🔄 Trang vừa load lại, đang đồng bộ lịch sử từ Server...");
		loadChatHistoryFromServer();
	}
});

async function loadChatHistoryFromServer() {
	try {
		const response = await fetch('http://localhost:8080/Spring-mvc/chat/history');
		const messages = await response.json();

		console.log(messages)

		messages.forEach(msg => {
			let type = (msg.senderId === myUserId) ? 'user' : 'bot';
			let isImage = (msg.type === "image") ? true : false;

			addMessage(type, msg.content, false, isImage);

		});

		chatHistoryStorage['ADMIN'] = document.getElementById('chatMessages').innerHTML;


		console.log("✅ Đã tải xong lịch sử Admin:", chatHistoryStorage['ADMIN']);

	} catch (error) {
		console.error("Lỗi tải lịch sử:", error);
	}
}

// Bật/Tắt Chatbox
chatToggle.onclick = () => {
	if (chatBox.style.display === "flex") {
		chatBox.style.display = "none";
	} else {
		chatBox.style.display = "flex";
		if (!currentMode) {
			document.getElementById('chatOptions').style.display = 'flex';
			document.getElementById('chatMain').style.display = 'none';
			chatBack.style.display = 'none';
		}
	}
};

chatClose.onclick = () => chatBox.style.display = "none";

// select Mode (AI OR CHAT WITH STAFF)
function selectMode(newMode) {
	// Save history to mode
	if (currentMode) {
		chatHistoryStorage[currentMode] = document.getElementById('chatMessages').innerHTML;
	}

	currentMode = newMode;

	document.getElementById('chatOptions').style.display = 'none';
	document.getElementById('chatMain').style.display = 'flex';
	document.getElementById('chatBack').style.display = 'inline';
	const btnImage = document.getElementById('btnImage');

	const msgContainer = document.getElementById('chatMessages');

	msgContainer.innerHTML = chatHistoryStorage[newMode] || '';

	if (newMode === 'AI') {
		btnImage.style.display = 'none';
		document.getElementById('chatTitle').innerText = '🤖 Trợ lý AI NVP';

		// Nếu chưa có tin nhắn nào (lần đầu vào), thì hiện lời chào
		if (!hasWelcomed['AI'] && msgContainer.innerHTML.trim() === "") {
			addMessage('bot', 'Xin chào! Em là AI tư vấn. Em có thể giúp anh/chị tìm điện thoại, so sánh giá và đặt hàng ạ.');
			hasWelcomed['AI'] = true;
		}

		// Đóng socket admin để tiết kiệm (tuỳ chọn)
		// if(socket) socket.close(); 

	} else {
		btnImage.style.display = 'flex';
		document.getElementById('chatTitle').innerText = '👨‍💼 Chat với Nhân viên';

		// Nếu chưa có tin nhắn nào, hiện lời chào
		if (!hasWelcomed['ADMIN'] && msgContainer.innerHTML.trim() === "") {
			addMessage('bot', 'Xin chào! Vui lòng đợi giây lát, nhân viên sẽ phản hồi ngay.');
			hasWelcomed['ADMIN'] = true;
		}

		connectWebSocket(); // Kết nối tới Admin

	}

	scrollToBottom();
}

chatBack.onclick = () => {
	if (currentMode) {
		chatHistoryStorage[currentMode] = document.getElementById('chatMessages').innerHTML;
	}

	currentMode = null;
	document.getElementById('chatOptions').style.display = 'flex';
	document.getElementById('chatMain').style.display = 'none';
	chatBack.style.display = 'none';
	document.getElementById('chatTitle').innerText = '💬 Hỗ trợ khách hàng';
};


function connectWebSocket() {
	if (socket && socket.readyState === WebSocket.OPEN) return;

	socket = new WebSocket("ws://localhost:8080/Spring-mvc/chat?userId=" + encodeURIComponent(myUserId));

	socket.onopen = () => console.log("✅ Connected to WebSocket (Admin Mode)");

	socket.onmessage = (event) => {
		const msgObj = JSON.parse(event.data);
		console.log("Received from Admin:", msgObj);

		// Chỉ hiện tin nhắn nếu đang ở chế độ Admin
		if (currentMode === 'ADMIN' && msgObj.senderId === "admin") {
			const isImage = (msgObj.type === "image");

			addMessage('bot', msgObj.content, false, isImage);
		}
	};

	socket.onclose = () => console.log("❌ Disconnected from WebSocket");
	socket.onerror = (e) => console.error("⚠️ WebSocket Error", e);
}


sendMessageBtn.onclick = handleUserSend;
messageInput.addEventListener("keypress", (e) => {
	if (e.key === "Enter") handleUserSend();
});

let isWaitingForAI = false;

//block input if AI is thinking
function handleUserSend() {
	if (isWaitingForAI) return;

	const text = messageInput.value.trim();
	if (!text) return;

	addMessage('user', text);
	messageInput.value = "";

	if (currentMode === 'AI') {
		toggleInputState(true); // KHÓA INPUT NGAY LẬP TỨC
		sendToAI(text);
	} else if (currentMode === 'ADMIN') {
		sendToAdmin(text);
	}
}

function toggleInputState(disabled) {
	isWaitingForAI = disabled;

	messageInput.disabled = disabled;
	sendMessageBtn.disabled = disabled;

	if (disabled) {
		sendMessageBtn.style.opacity = "0.6";
		sendMessageBtn.style.cursor = "not-allowed";
		messageInput.placeholder = "AI đang trả lời...";
	} else {
		sendMessageBtn.style.opacity = "1";
		sendMessageBtn.style.cursor = "pointer";
		messageInput.placeholder = "Nhập tin nhắn...";
		messageInput.focus();
	}
}

// chat with staff
function sendToAdmin(text) {
	if (socket && socket.readyState === WebSocket.OPEN) {
		const msgSent = {
			senderId: myUserId,
			senderName: myUserName,
			receiverId: "admin",
			content: text,
			type: "text"
		};
		socket.send(JSON.stringify(msgSent));
	} else {
		addMessage('bot', '⚠️ Mất kết nối. Đang thử kết nối lại...');
		connectWebSocket();
	}
}


// chat with AI call API from server at python
async function sendToAI(question) {

	// typing effect
	const typingMsgId = showTyping();


	try {
		const response = await fetch('http://localhost:8000/api/chat', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				session_id: aiSessionId,
				message: question,
				userId : myUserId
			})
		});

		const data = await response.json();


		const typingElement = document.getElementById(typingMsgId);
		if (typingElement) typingElement.remove();

		// use marked.js to render HTML return by CHAT import JS
		if (data.text) {
			const htmlContent = marked.parse(data.text);

			addMessage('bot', htmlContent, true); // true = isHTML
		}


		if (data.card) {
			addCard(data.card);
		}

	} catch (error) {
		// ERROR WHILE CHAT
		const typingElement = document.getElementById(typingMsgId);
		if (typingElement) {
			typingElement.innerHTML = "❌ Lỗi kết nối AI.";
			typingElement.style.color = "red";
		}
		console.error(error);
	} finally {
		toggleInputState(false);
	}
}


//render message in chat context
function addMessage(sender, content, isHTML = false, isImage = false) {
	const msgDiv = document.createElement("div");
	// sender = 'user' -> class="message user-message"
	// sender = 'bot'  -> class="message bot-message"
	msgDiv.className = `message ${sender === 'user' ? 'user-message' : 'bot-message'}`;
	msgDiv.id = 'msg-' + new Date().getTime();

	if (isHTML) {
		msgDiv.innerHTML = content;
	} else if (isImage) {
		msgDiv.innerHTML = `<img src="${content}" 
		                                 style="max-width: 250px; border-radius: 10px; border: 1px solid #ddd; cursor: zoom-in;" 
		                                 onclick="openImageModal(this.src)">`;
	}
	else {
		msgDiv.innerText = content;
	}

	chatMessages.appendChild(msgDiv);
	scrollToBottom();

	return msgDiv;
}

//send img while chat with STAFF
function handleImageSelect() {
	const fileInput = document.getElementById("imageInput");
	const file = fileInput.files[0];

	if (!file) return;

	if (file.size > 2 * 1024 * 1024) {
		alert("File quá lớn! Vui lòng chọn ảnh dưới 2MB.");
		return;
	}

	const reader = new FileReader();

	reader.onload = function(event) {
		const base64String = event.target.result; 

		if (socket.readyState === WebSocket.OPEN) {
			const msgSent = {
				senderId: myUserId,
				senderName: myUserName,
				receiverId: "admin",
				content: base64String,
				type: "image"
			};
			socket.send(JSON.stringify(msgSent));

			addMessage('user', base64String, false, true); // true = isImage
		}
	};

	reader.readAsDataURL(file);//đọc các kí tự nhị phân thành BASE 64 (ký tự trong bảng chữ cái)

	fileInput.value = '';
}

//zoom img
function openImageModal(src) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("fullImage");
    
    modal.style.display = "flex"; // Hoặc "block"
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    
    modalImg.src = src; 
}

function closeImageModal() {
    document.getElementById("imageModal").style.display = "none";
}

document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        closeImageModal();
    }
});

function addCard(cardData) {
	const cardHTML = `
        <div class="product-card">
            <img src="${cardData.image_url}" alt="${cardData.product_name}" onerror="this.style.display='none'" style="width: 100%; height: 150px; object-fit: cover; object-position: center;">
            <div class="body">
                <h4>${cardData.product_name}</h4>
                <a href="${cardData.product_link}" class="btn" target="_blank">Xem chi tiết & Mua ngay</a>
            </div>
        </div>
    `;
	const div = document.createElement('div');
	div.innerHTML = cardHTML;
	chatMessages.appendChild(div);
	setTimeout(scrollToBottom, 100);
}


function showTyping() {
	const msgDiv = document.createElement('div');
	msgDiv.className = 'message bot-message';
	msgDiv.id = 'typing-' + new Date().getTime();

	// Tạo 3 dấu chấm
	msgDiv.innerHTML = `
        <div class="typing-indicator">
            <span></span><span></span><span></span>
        </div>
    `;

	document.getElementById('chatMessages').appendChild(msgDiv);
	scrollToBottom(); // Cuộn xuống ngay khi hiện typing
	return msgDiv.id; // Trả về ID để tí nữa xóa
}

function scrollToBottom() {
	const container = document.getElementById('chatMessages');
	container.scrollTo({
		top: container.scrollHeight,
		behavior: 'smooth'
	});
}