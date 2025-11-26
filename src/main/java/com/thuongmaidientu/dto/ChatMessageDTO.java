package com.thuongmaidientu.dto;

import java.time.LocalDateTime;

import org.bson.Document;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.google.gson.annotations.SerializedName;

import lombok.Data;


@Data
public class ChatMessageDTO {

    private Long id; 

    private String senderId;
    
    private String senderName;

    private String receiverId; // dùng cho chat cá nhân

    private String content;

    private String type; // "text", "image", "file", "sticker", "call"

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;
    
    private Id _id; 
    

    static class Id {
        @SerializedName("$oid")
        private String oid;

        public String getOid() {
            return oid;
        }
    }

    public String getIdHex() {
        return _id != null ? _id.oid : null;
    }
    
    public Document toDocument() {
        return new Document("senderId", senderId)
        		.append("senderName", senderName)
                .append("receiverId", receiverId)
                .append("content", content)
                .append("type", type)
                .append("timestamp", timestamp.toString());
    }
  
}
