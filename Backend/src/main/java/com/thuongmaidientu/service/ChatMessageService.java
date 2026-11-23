package com.thuongmaidientu.service;

import java.util.List;

import com.thuongmaidientu.dto.ChatMessageDTO;

public interface ChatMessageService {

	public Boolean saveMessage(ChatMessageDTO msg);

	public List<ChatMessageDTO> getAllMessages();

	public List<ChatMessageDTO> getMessagesBetween(String userA, String userB);
	
	public Integer getQuantityClientChat();
	
	public void deleteMsgClient(String clientId);
}
