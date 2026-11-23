package com.thuongmaidientu.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
public class ChatMessageDTO {

    private Long id; 

    private String senderId;
    
    private String senderName;

    private String receiverId;

    private String content;

    private String type; // "text", "image", "file", "sticker", "call"

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;
}
