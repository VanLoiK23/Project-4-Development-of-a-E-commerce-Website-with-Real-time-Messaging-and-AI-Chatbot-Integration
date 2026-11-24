package com.thuongmaidientu.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageResponse {
    private Long id;
    private String senderId;
    private String senderName;
    private String receiverId;
    private String content;
    private String type;
    private java.time.LocalDateTime timestamp;
}
