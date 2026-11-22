package com.thuongmaidientu.api.web;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thuongmaidientu.dto.ChatMessageDTO;
import com.thuongmaidientu.dto.UserDTO;
import com.thuongmaidientu.service.IChatMessageService;
import com.thuongmaidientu.service.impl.ChatMessageService;

import jakarta.servlet.http.HttpSession;

@RestController(value = "chatApiOfWeb")
@RequestMapping("/chat")
public class ChatAPI {
	private IChatMessageService chatMessageService=new ChatMessageService();

	@GetMapping("/history")
	public ResponseEntity<?> getHistoryMessage(HttpSession session) {
		try {

			UserDTO user = (UserDTO) session.getAttribute("user");
			if (user == null) {
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Không tìm thấy người dùng");
			}

			List<ChatMessageDTO> chatMessages = chatMessageService.getMessagesBetween(user.getId().toString(), "admin");
			
			return ResponseEntity.ok(chatMessages);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi lấy tin nhắn");
		}
	}

}
