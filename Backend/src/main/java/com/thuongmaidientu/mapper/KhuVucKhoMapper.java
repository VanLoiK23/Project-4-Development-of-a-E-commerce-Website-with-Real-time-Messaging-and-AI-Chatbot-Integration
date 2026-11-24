package com.thuongmaidientu.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.thuongmaidientu.dto.KhuVucKhoDTO;
import com.thuongmaidientu.dto.request.KhuVucKhoRequest;
import com.thuongmaidientu.dto.response.KhuVucKhoResponse;
import com.thuongmaidientu.entity.KhuVucKhoEntity;

@Mapper(componentModel = "spring")
public interface KhuVucKhoMapper {

    @Mapping(target = "listProductFromKho", ignore = true)
    KhuVucKhoEntity toEntity(KhuVucKhoRequest request);

    KhuVucKhoResponse toResponse(KhuVucKhoEntity entity);

    @Mapping(target = "id", source = "maKhuVuc")
    KhuVucKhoDTO toDTO(KhuVucKhoEntity entity);

    @Mapping(target = "maKhuVuc", source = "id")
    @Mapping(target = "listProductFromKho", ignore = true)
    KhuVucKhoEntity toEntity(KhuVucKhoDTO dto);
}
