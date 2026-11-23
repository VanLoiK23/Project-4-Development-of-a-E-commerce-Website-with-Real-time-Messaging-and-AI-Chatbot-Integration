package com.thuongmaidientu.handler;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.web.util.UriComponentsBuilder;

import tools.jackson.databind.ObjectMapper;
import com.thuongmaidientu.dto.ChatMessageDTO;
import com.thuongmaidientu.service.ChatMessageService;

@Component
public class ChatHandler extends TextWebSocketHandler {
	
	@Autowired
	private ChatMessageService chatMessageService;

    private static final Map<String, WebSocketSession> users = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        try {
            MultiValueMap<String, String> params = UriComponentsBuilder.fromUri(session.getUri()).build().getQueryParams();
            String userId = params.getFirst("userId");
            if (userId == null) {
                session.close(CloseStatus.BAD_DATA);
                return;
            }
            session.getAttributes().put("userId", userId);
            users.put(userId, session);
        } catch (Exception e) {
            e.printStackTrace();
            session.close(CloseStatus.SERVER_ERROR);
        }
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String json = message.getPayload();
        ChatMessageDTO msg = objectMapper.readValue(json, ChatMessageDTO.class);
        
        msg.setTimestamp(LocalDateTime.now());
        WebSocketSession receiver = users.get(msg.getReceiverId());
        if (receiver != null && receiver.isOpen()) {
            receiver.sendMessage(new TextMessage(objectMapper.writeValueAsString(msg)));
        } 
        
        if (chatMessageService != null) {
            chatMessageService.saveMessage(msg);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        String userId = (String) session.getAttributes().get("userId");
        if (userId != null) {
            users.remove(userId);
        }
    }
}
