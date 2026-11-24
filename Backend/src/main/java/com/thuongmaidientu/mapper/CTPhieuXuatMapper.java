package com.thuongmaidientu.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.thuongmaidientu.dto.CTPhieuXuatDTO;
import com.thuongmaidientu.dto.request.CTPhieuXuatRequest;
import com.thuongmaidientu.dto.response.CTPhieuXuatResponse;
import com.thuongmaidientu.entity.CTPhieuXuat;

@Mapper(componentModel = "spring")
public interface CTPhieuXuatMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "phieuXuat", ignore = true)
    @Mapping(target = "phienBanSanPhamXuat", ignore = true)
    CTPhieuXuat toEntity(CTPhieuXuatRequest request);

    @Mapping(target = "maPhieuXuat", source = "id.maphieuxuat")
    @Mapping(target = "maPhienBanSP", source = "id.maPhienBanSP")
    CTPhieuXuatResponse toResponse(CTPhieuXuat entity);

    @Mapping(target = "phieuXuatId", source = "id.maphieuxuat")
    @Mapping(target = "phienBanSanPhamXuatId", source = "id.maPhienBanSP")
    CTPhieuXuatDTO toDTO(CTPhieuXuat entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "phieuXuat", ignore = true)
    @Mapping(target = "phienBanSanPhamXuat", ignore = true)
    CTPhieuXuat toEntity(CTPhieuXuatDTO dto);
}
