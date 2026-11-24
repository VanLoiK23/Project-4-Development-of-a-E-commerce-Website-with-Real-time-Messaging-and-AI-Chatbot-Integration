package com.thuongmaidientu.mapper;

import org.mapstruct.Mapper;

import com.thuongmaidientu.dto.SlideDTO;
import com.thuongmaidientu.dto.request.SlideRequest;
import com.thuongmaidientu.dto.response.SlideResponse;
import com.thuongmaidientu.entity.SlideEntity;

@Mapper(componentModel = "spring")
public interface SlideMapper {

    SlideEntity toEntity(SlideRequest request);

    SlideResponse toResponse(SlideEntity entity);

    SlideDTO toDTO(SlideEntity entity);

    SlideEntity toEntity(SlideDTO dto);
}
