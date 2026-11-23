package com.thuongmaidientu.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.thuongmaidientu.dto.ChiTietPhieuXuatDTO;
import com.thuongmaidientu.dto.request.ChiTietPhieuXuatRequest;
import com.thuongmaidientu.dto.response.ChiTietPhieuXuatResponse;
import com.thuongmaidientu.entity.ChiTietPhieuXuatEntity;

@Mapper(componentModel = "spring")
public interface ChiTietPhieuXuatMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "phieuXuat", ignore = true)
    @Mapping(target = "phienBanSanPhamXuat", ignore = true)
    ChiTietPhieuXuatEntity toEntity(ChiTietPhieuXuatRequest request);

    @Mapping(target = "maPhieuXuat", source = "id.maphieuxuat")
    @Mapping(target = "maPhienBanSP", source = "id.maPhienBanSP")
    ChiTietPhieuXuatResponse toResponse(ChiTietPhieuXuatEntity entity);

    @Mapping(target = "phieuXuatId", source = "id.maphieuxuat")
    @Mapping(target = "phienBanSanPhamXuatId", source = "id.maPhienBanSP")
    ChiTietPhieuXuatDTO toDTO(ChiTietPhieuXuatEntity entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "phieuXuat", ignore = true)
    @Mapping(target = "phienBanSanPhamXuat", ignore = true)
    ChiTietPhieuXuatEntity toEntity(ChiTietPhieuXuatDTO dto);
}
