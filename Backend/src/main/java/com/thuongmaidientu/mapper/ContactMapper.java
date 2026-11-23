package com.thuongmaidientu.mapper;

import org.mapstruct.Mapper;

import com.thuongmaidientu.dto.ContactDTO;
import com.thuongmaidientu.dto.request.ContactRequest;
import com.thuongmaidientu.dto.response.ContactResponse;
import com.thuongmaidientu.entity.ContactEntity;

@Mapper(componentModel = "spring")
public interface ContactMapper {

    ContactEntity toEntity(ContactRequest request);

    ContactResponse toResponse(ContactEntity entity);

    ContactDTO toDTO(ContactEntity entity);

    ContactEntity toEntity(ContactDTO dto);
}
