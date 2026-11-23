package com.thuongmaidientu.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.thuongmaidientu.dto.CTSanPhamDTO;
import com.thuongmaidientu.dto.request.CTSanPhamRequest;
import com.thuongmaidientu.dto.response.CTSanPhamResponse;
import com.thuongmaidientu.entity.CTSanPhamEntity;

@Mapper(componentModel = "spring")
public interface CTSanPhamMapper {

    @Mapping(target = "productVersion", ignore = true)
    @Mapping(target = "pn", ignore = true)
    @Mapping(target = "px", ignore = true)
    CTSanPhamEntity toEntity(CTSanPhamRequest request);

    @Mapping(target = "maphienbansp", source = "productVersion.maPhienBanSP")
    @Mapping(target = "maphieunhap", source = "pn.id")
    @Mapping(target = "maphieuxuat", source = "px.id")
    CTSanPhamResponse toResponse(CTSanPhamEntity entity);

    @Mapping(target = "productVersionId", source = "productVersion.maPhienBanSP")
    @Mapping(target = "pnId", source = "pn.id")
    @Mapping(target = "pxId", source = "px.id")
    CTSanPhamDTO toDTO(CTSanPhamEntity entity);

    @Mapping(target = "productVersion", ignore = true)
    @Mapping(target = "pn", ignore = true)
    @Mapping(target = "px", ignore = true)
    CTSanPhamEntity toEntity(CTSanPhamDTO dto);
}
