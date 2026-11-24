package com.thuongmaidientu.api.admin;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.thuongmaidientu.dto.ChatMessageDTO;
import com.thuongmaidientu.dto.UserDTO;
import com.thuongmaidientu.service.ChatMessageService;
import com.thuongmaidientu.service.impl.ChatMessageServiceImpl;

import jakarta.servlet.http.HttpSession;

@RestController(value = "chatApiOfAdmin")
@RequestMapping("/quan-tri/chat")
public class ChatAPI {

	@Autowired
	private ChatMessageService chatMessageService;

	@GetMapping
	public ResponseEntity<?> getHistoryMessage() {
		try {
			List<ChatMessageDTO> chatMessages = chatMessageService.getAllMessages();

			return ResponseEntity.ok(chatMessages);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi lấy tin nhắn");
		}
	}

	@DeleteMapping
	public void deleteMsgClient(@RequestParam("clientId") String clientId) {
		chatMessageService.deleteMsgClient(clientId);
	}

}
