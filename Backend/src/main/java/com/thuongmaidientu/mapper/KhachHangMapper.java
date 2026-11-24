package com.thuongmaidientu.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.thuongmaidientu.dto.KhachHangDTO;
import com.thuongmaidientu.dto.request.KhachHangRequest;
import com.thuongmaidientu.dto.response.KhachHangResponse;
import com.thuongmaidientu.entity.KhachHangEntity;

@Mapper(componentModel = "spring")
public interface KhachHangMapper {

    @Mapping(target = "clientListCart", ignore = true)
    @Mapping(target = "clientCommentsProduct", ignore = true)
    @Mapping(target = "clientCommentsArticle", ignore = true)
    @Mapping(target = "clientOrder", ignore = true)
    @Mapping(target = "clientInfoAddress", ignore = true)
    KhachHangEntity toEntity(KhachHangRequest request);

    KhachHangResponse toResponse(KhachHangEntity entity);

    @Mapping(target = "id", source = "maKhachHang")
    @Mapping(target = "soDienThoai", source = "soDienThoai")
    @Mapping(target = "trangThai", source = "trangThai")
    KhachHangDTO toDTO(KhachHangEntity entity);

    @Mapping(target = "maKhachHang", source = "id")
    @Mapping(target = "clientListCart", ignore = true)
    @Mapping(target = "clientCommentsProduct", ignore = true)
    @Mapping(target = "clientCommentsArticle", ignore = true)
    @Mapping(target = "clientOrder", ignore = true)
    @Mapping(target = "clientInfoAddress", ignore = true)
    KhachHangEntity toEntity(KhachHangDTO dto);
}
