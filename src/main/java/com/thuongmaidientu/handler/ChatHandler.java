package com.thuongmaidientu.handler;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.MultiValueMap;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.web.util.UriComponentsBuilder;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.thuongmaidientu.dto.ChatMessageDTO;
import com.thuongmaidientu.service.IChatMessageService;
import com.thuongmaidientu.service.impl.ChatMessageService;

public class ChatHandler extends TextWebSocketHandler {
	
	private IChatMessageService chatMessageService=new ChatMessageService();

    private static Map<String, WebSocketSession> users = new ConcurrentHashMap<>();
    private Gson gson = new GsonBuilder()
            .registerTypeAdapter(LocalDateTime.class, 
                (com.google.gson.JsonDeserializer<LocalDateTime>) (json, type, context) ->
                    LocalDateTime.parse(json.getAsString(), DateTimeFormatter.ISO_LOCAL_DATE_TIME))
            .registerTypeAdapter(LocalDateTime.class, 
                (com.google.gson.JsonSerializer<LocalDateTime>) (src, type, context) ->
                    new com.google.gson.JsonPrimitive(src.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)))
            .create();
    
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println("🟢 New connection: " + session.getId() + " - URI: " + session.getUri());
        try {
            MultiValueMap<String, String> params = UriComponentsBuilder.fromUri(session.getUri()).build().getQueryParams();
            String userId = params.getFirst("userId");
            if (userId == null) {
                System.out.println("❌ userId missing, closing socket");
                session.close(CloseStatus.BAD_DATA);
                return;
            }
            session.getAttributes().put("userId", userId);
            users.put(userId, session);
            System.out.println("✅ Connected: " + userId);
        } catch (Exception e) {
            e.printStackTrace();
            session.close(CloseStatus.SERVER_ERROR);
        }
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String json = message.getPayload();
        ChatMessageDTO msg = gson.fromJson(json, ChatMessageDTO.class);
        
        msg.setTimestamp(LocalDateTime.now());
        // validate msg fields...
        WebSocketSession receiver = users.get(msg.getReceiverId());
        if (receiver != null && receiver.isOpen()) {
            receiver.sendMessage(new TextMessage(gson.toJson(msg)));
        } 
        
        chatMessageService.saveMessage(msg);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        String userId = (String) session.getAttributes().get("userId");
        if (userId != null) users.remove(userId);
    }

}
