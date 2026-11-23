package com.thuongmaidientu.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.thuongmaidientu.dto.MauSacDTO;
import com.thuongmaidientu.dto.request.MauSacRequest;
import com.thuongmaidientu.dto.response.MauSacResponse;
import com.thuongmaidientu.entity.MauSacEntity;

@Mapper(componentModel = "spring")
public interface MauSacMapper {

    @Mapping(target = "listProductByColor", ignore = true)
    MauSacEntity toEntity(MauSacRequest request);

    MauSacResponse toResponse(MauSacEntity entity);

    @Mapping(target = "id", source = "maMauSac")
    MauSacDTO toDTO(MauSacEntity entity);

    @Mapping(target = "maMauSac", source = "id")
    @Mapping(target = "listProductByColor", ignore = true)
    MauSacEntity toEntity(MauSacDTO dto);
}
