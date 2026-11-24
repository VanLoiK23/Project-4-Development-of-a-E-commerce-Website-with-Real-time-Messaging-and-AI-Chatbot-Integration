package com.thuongmaidientu.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.thuongmaidientu.dto.ColorDTO;
import com.thuongmaidientu.dto.request.ColorRequest;
import com.thuongmaidientu.dto.response.ColorResponse;
import com.thuongmaidientu.entity.ColorEntity;

@Mapper(componentModel = "spring")
public interface ColorMapper {

    @Mapping(target = "listProductByColor", ignore = true)
    ColorEntity toEntity(ColorRequest request);

    ColorResponse toResponse(ColorEntity entity);

    @Mapping(target = "id", source = "maMauSac")
    ColorDTO toDTO(ColorEntity entity);

    @Mapping(target = "maMauSac", source = "id")
    @Mapping(target = "listProductByColor", ignore = true)
    ColorEntity toEntity(ColorDTO dto);
}
