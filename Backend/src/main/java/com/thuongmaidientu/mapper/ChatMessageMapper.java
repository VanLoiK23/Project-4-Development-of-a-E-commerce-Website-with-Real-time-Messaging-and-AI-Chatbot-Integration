package com.thuongmaidientu.mapper;

import org.mapstruct.Mapper;

import com.thuongmaidientu.dto.ChatMessageDTO;
import com.thuongmaidientu.dto.request.ChatMessageRequest;
import com.thuongmaidientu.dto.response.ChatMessageResponse;
import com.thuongmaidientu.entity.ChatMessageEntity;

@Mapper(componentModel = "spring")
public interface ChatMessageMapper {

    ChatMessageEntity toEntity(ChatMessageRequest request);

    ChatMessageResponse toResponse(ChatMessageEntity entity);

    ChatMessageDTO toDTO(ChatMessageEntity entity);

    ChatMessageEntity toEntity(ChatMessageDTO dto);
}
