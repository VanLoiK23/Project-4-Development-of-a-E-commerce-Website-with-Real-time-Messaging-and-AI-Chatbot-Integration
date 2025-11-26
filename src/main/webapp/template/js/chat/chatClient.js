let clients = [];

const clientList = document.getElementById('clientList');
const chatHeader = document.getElementById('chatHeader');
const chatMessages = document.getElementById('chatMessages');
const msgInput = document.getElementById('msgInput');
const sendBtn = document.getElementById('sendBtn');

const userId = "admin";
const socket = new WebSocket("ws://localhost:8080/Spring-mvc/chat?userId=" + encodeURIComponent(userId));

socket.onopen = () => console.log("✅ Connected to WebSocket");
socket.onclose = () => console.log("❌ Disconnected from WebSocket");
socket.onerror = (e) => console.error("⚠️ WebSocket Error", e);

let activeClient = null;
// Structure: key = clientId, value = array of objects { from: 'admin'/'client', text: 'content', isImage: boolean }
const chatHistory = {}; 

// send image
function handleAdminImageSelect() {
    const fileInput = document.getElementById("imageInputAdmin");
    const file = fileInput.files[0];
    if (!file) return;

    if (!activeClient) {
        alert('Hãy chọn một khách hàng trước khi gửi ảnh!');
        fileInput.value = '';
        return;
    }

    if (file.size > 5 * 1024 * 1024) { 
        alert("Ảnh quá lớn (Max 5MB)");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const base64String = event.target.result;
        
        if (socket.readyState === WebSocket.OPEN) {
            const msgSent = { 
                senderId: userId, 
                receiverId: activeClient.id, 
                content: base64String, 
                type: "image" 
            };
            socket.send(JSON.stringify(msgSent));

            // 2. Lưu vào History
            if (!chatHistory[activeClient.id]) chatHistory[activeClient.id] = [];
            chatHistory[activeClient.id].push({ from: 'admin', text: base64String, isImage: true });

            // 3. Render lại
            renderChatMessages(activeClient.id);
        } else {
            alert("Mất kết nối WebSocket!");
        }
    };
    reader.readAsDataURL(file);
    fileInput.value = ''; // Reset input
}

function renderClients(list) {
    clientList.innerHTML = '';
    list.forEach(c => {
        const div = document.createElement('div');
        div.className = `client ${c.online ? 'online' : 'offline'}`;
        if (activeClient && activeClient.id === c.id) div.classList.add('active');

        const avatarHTML = c.avatarUrl
            ? `<div class="avatar"><img src="${c.avatarUrl}" alt="${c.name}"><div class="status"></div></div>`
            : `<div class="avatar">${c.name.charAt(0)}<div class="status"></div></div>`;

        // Hiển thị preview tin nhắn (Nếu là ảnh thì hiện [Hình ảnh])
        const previewMsg = c.lastMsgIsImage ? '📷 [Hình ảnh]' : (c.lastMsg || '');

        div.innerHTML = `
        ${avatarHTML}
        <div class="info">
          <div class="name">${c.name}</div>
          <div class="last-msg">${previewMsg}</div> 
        </div>`;

        div.onclick = () => openChat(c);
        clientList.appendChild(div);
    });
}

function openChat(client) {
    activeClient = client;

    // 🔹 Cập nhật header
    const avatarHTML = client.avatarUrl
        ? `<img class="header-avatar" src="${client.avatarUrl}" alt="${client.name}">`
        : `<div class="header-avatar">${client.name.charAt(0)}</div>`;

    chatHeader.innerHTML = `
    ${avatarHTML}
    <div class="header-info">
      <div class="header-name">${client.name}</div>
      <div class="header-status">${client.online ? 'Đang hoạt động' : 'Ngoại tuyến'}</div>
    </div>`;

    // Re-render để highlight active client
    renderClients(clients);
    renderChatMessages(client.id);
}

function renderChatMessages(clientId) {
    const messages = chatHistory[clientId] || [];
    
    chatMessages.innerHTML = messages.map(m => {
        const senderClass = m.from === 'admin' ? 'me' : 'them';
        
        // Kiểm tra nếu là ảnh
        if (m.isImage) {
            return `<div class="msg ${senderClass}">
                        <img src="${m.text}" onclick="openImageModal(this.src)">
                    </div>`;
        } else {
            return `<div class="msg ${senderClass}">${m.text}</div>`;
        }
    }).join('');

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

document.getElementById('search').oninput = e => {
     const keyword = e.target.value.toLowerCase();
     renderClients(clients.filter(c => c.name.toLowerCase().includes(keyword)));
};

// receive message from socket
socket.onmessage = (event) => {
    const msgObj = JSON.parse(event.data);
    console.log("Received message:", msgObj);

    const senderId = msgObj.senderId;
    const content = msgObj.content;
    const isImage = (msgObj.type === "image"); // check type message

    // Update client UI
    let existing = clients.find(c => c.id === senderId);
    if (existing) {
        existing.lastMsg = isImage ? '📷 [Hình ảnh]' : content;
        existing.lastMsgIsImage = isImage; 
        existing.online = true;
        // Đẩy lên đầu
        clients = [existing, ...clients.filter(c => c.id !== senderId)];
    } else {
        const newClient = {
            id: senderId,
            name: msgObj.senderName || senderId,
            online: true,
            lastMsg: isImage ? '📷 [Hình ảnh]' : content,
            lastMsgIsImage: isImage
        };
        clients.unshift(newClient);
    }

    renderClients(clients);

    // save to history
    if (!chatHistory[senderId]) chatHistory[senderId] = [];
    chatHistory[senderId].push({ from: senderId, text: content, isImage: isImage });
    
    // if current chat is user then render now
    if (activeClient && activeClient.id === senderId){
        renderChatMessages(senderId);
    }
};

//load history message from DB 
document.addEventListener("DOMContentLoaded", function() {
    loadChatHistory();
});

async function loadChatHistory() {
    try {
        const response = await fetch('http://localhost:8080/Spring-mvc/quan-tri/chat');
        const messages = await response.json();

        messages.forEach(msg => {
            let senderId = msg.senderId;
            let senderName = msg.senderName;
            let content = msg.content;
            let receiverId = msg.receiverId;
            let type = msg.type;
            let isImage = (type === "image");

            if (senderId === 'admin') {
                // Tin nhắn Admin gửi đi
                if (!chatHistory[receiverId]) chatHistory[receiverId] = [];
                chatHistory[receiverId].push({ from: 'admin', text: content, isImage: isImage });
            } else {
                // Tin nhắn Client gửi đến
                let existing = clients.find(c => c.id === senderId);
                if (existing) {
                    existing.lastMsg = isImage ? '📷 [Hình ảnh]' : content;
                    existing.lastMsgIsImage = isImage;
                    existing.online = false;
                    // Đẩy lên đầu nếu chưa có
                    if(!clients.includes(existing)) clients = [existing, ...clients.filter(c => c.id !== senderId)];
                } else {
                    const newClient = {
                        id: senderId,
                        name: senderName || senderId,
                        online: false,
                        lastMsg: isImage ? '📷 [Hình ảnh]' : content,
                        lastMsgIsImage: isImage
                    };
                    clients.push(newClient); 
                }

                if (!chatHistory[senderId]) chatHistory[senderId] = [];
                chatHistory[senderId].push({ from: senderId, text: content, isImage: isImage });
            }
        });
        
        renderClients(clients);
        console.log("✅ Đã tải xong lịch sử Admin");

    } catch (error) {
        console.error("Lỗi tải lịch sử:", error);
    }
}

sendBtn.onclick = () => {
    if (!activeClient) return alert('Hãy chọn một khách hàng!');
    const text = msgInput.value.trim();
    if (!text) return;

    if (socket.readyState === WebSocket.OPEN) {
        const msgSent = { senderId: userId, receiverId: activeClient.id, content: text, type: "text" };
        socket.send(JSON.stringify(msgSent));

        // Lưu tin nhắn vào history
        if (!chatHistory[activeClient.id]) chatHistory[activeClient.id] = [];
        chatHistory[activeClient.id].push({ from: 'admin', text: text, isImage: false });

        // Render lại
        renderChatMessages(activeClient.id);
        msgInput.value = '';
    } else {
        alert("Không thể gửi tin nhắn (Mất kết nối Socket)");
    }
};

msgInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendBtn.click();
});

//zoom img
function openImageModal(src) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("fullImage");
    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modalImg.src = src;
}

function closeImageModal() {
    document.getElementById("imageModal").style.display = "none";
}