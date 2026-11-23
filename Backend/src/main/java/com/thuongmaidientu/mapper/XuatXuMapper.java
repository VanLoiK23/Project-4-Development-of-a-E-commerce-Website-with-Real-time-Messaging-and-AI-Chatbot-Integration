package com.thuongmaidientu.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.thuongmaidientu.dto.XuatXuDTO;
import com.thuongmaidientu.dto.request.XuatXuRequest;
import com.thuongmaidientu.dto.response.XuatXuResponse;
import com.thuongmaidientu.entity.XuatXuEntity;

@Mapper(componentModel = "spring")
public interface XuatXuMapper {

    @Mapping(target = "xuatxus", ignore = true)
    XuatXuEntity toEntity(XuatXuRequest request);

    XuatXuResponse toResponse(XuatXuEntity entity);

    @Mapping(target = "id", source = "maXuatXu")
    XuatXuDTO toDTO(XuatXuEntity entity);

    @Mapping(target = "maXuatXu", source = "id")
    @Mapping(target = "xuatxus", ignore = true)
    XuatXuEntity toEntity(XuatXuDTO dto);
}
