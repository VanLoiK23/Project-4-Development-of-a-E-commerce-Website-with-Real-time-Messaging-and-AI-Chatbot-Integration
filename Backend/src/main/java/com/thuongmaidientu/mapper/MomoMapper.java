package com.thuongmaidientu.mapper;

import org.mapstruct.Mapper;

import com.thuongmaidientu.dto.MomoDTO;
import com.thuongmaidientu.dto.request.MomoRequest;
import com.thuongmaidientu.dto.response.MomoResponse;
import com.thuongmaidientu.entity.MomoEntity;

@Mapper(componentModel = "spring")
public interface MomoMapper {

    MomoEntity toEntity(MomoRequest request);

    MomoResponse toResponse(MomoEntity entity);

    MomoDTO toDTO(MomoEntity entity);

    MomoEntity toEntity(MomoDTO dto);
}
