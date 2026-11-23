package com.thuongmaidientu.entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "chat_messages")
@Data
public class ChatMessageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sender_id", length = 100, nullable = false)
    private String senderId;

    @Column(name = "sender_name", length = 100)
    private String senderName;

    @Column(name = "receiver_id", length = 100, nullable = false)
    private String receiverId;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @Column(name = "type", length = 50)
    private String type;

    @Column(name = "\"timestamp\"", nullable = false)
    private LocalDateTime timestamp;
}
