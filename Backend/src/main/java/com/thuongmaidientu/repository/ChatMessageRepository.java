package com.thuongmaidientu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.thuongmaidientu.entity.ChatMessageEntity;

public interface ChatMessageRepository extends JpaRepository<ChatMessageEntity, Long> {

    @Query("SELECT m FROM ChatMessageEntity m WHERE (m.senderId = :userA AND m.receiverId = :userB) OR (m.senderId = :userB AND m.receiverId = :userA) ORDER BY m.timestamp ASC")
    List<ChatMessageEntity> findMessagesBetween(@Param("userA") String userA, @Param("userB") String userB);

    @Query("SELECT COUNT(DISTINCT m.senderId) FROM ChatMessageEntity m WHERE m.senderId != :exclude")
    long countUniqueSendersExcluding(@Param("exclude") String exclude);

    @Modifying
    @Transactional
    @Query("DELETE FROM ChatMessageEntity m WHERE m.senderId = :clientId OR m.receiverId = :clientId")
    void deleteClientMessages(@Param("clientId") String clientId);
}
