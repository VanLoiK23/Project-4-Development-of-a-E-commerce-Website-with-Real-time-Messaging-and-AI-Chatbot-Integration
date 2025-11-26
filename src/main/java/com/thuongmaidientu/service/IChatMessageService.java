package com.thuongmaidientu.service;

import java.util.List;

import com.thuongmaidientu.dto.ChatMessageDTO;

public interface IChatMessageService {

	public Boolean saveMessage(ChatMessageDTO msg);

	public List<ChatMessageDTO> getAllMessages();

	public List<ChatMessageDTO> getMessagesBetween(String userA, String userB);
}
