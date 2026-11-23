package com.thuongmaidientu.service.impl;

import com.thuongmaidientu.mapper.ChatMessageMapper;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thuongmaidientu.dto.ChatMessageDTO;
import com.thuongmaidientu.entity.ChatMessageEntity;
import com.thuongmaidientu.repository.ChatMessageRepository;
import com.thuongmaidientu.service.ChatMessageService;

@Service
public class ChatMessageServiceImpl implements ChatMessageService {
	@Autowired
	private ChatMessageMapper chatMessageMapper;


	@Autowired
	private ChatMessageRepository chatMessageRepository;

	@Override
	public Boolean saveMessage(ChatMessageDTO saveChatMessage) {
		try {
			ChatMessageEntity entity = chatMessageMapper.toEntity(saveChatMessage);
			chatMessageRepository.save(entity);
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	@Override
	public List<ChatMessageDTO> getAllMessages() {
		List<ChatMessageDTO> result = new ArrayList<>();
		List<ChatMessageEntity> entities = chatMessageRepository.findAll();
		for (ChatMessageEntity entity : entities) {
			result.add(toDTO(entity));
		}
		return result;
	}

	@Override
	public List<ChatMessageDTO> getMessagesBetween(String userA, String userB) {
		List<ChatMessageDTO> result = new ArrayList<>();
		List<ChatMessageEntity> entities = chatMessageRepository.findMessagesBetween(userA, userB);
		for (ChatMessageEntity entity : entities) {
			result.add(toDTO(entity));
		}
		return result;
	}

	@Override
	public Integer getQuantityClientChat() {
		return (int) chatMessageRepository.countUniqueSendersExcluding("admin");
	}

	@Override
	public void deleteMsgClient(String clientId) {
		if (clientId == null || clientId.trim().isEmpty()) {
			return;
		}
		chatMessageRepository.deleteClientMessages(clientId);
	}

	private ChatMessageDTO toDTO(ChatMessageEntity entity) {
		return chatMessageMapper.toDTO(entity);
	}
}
