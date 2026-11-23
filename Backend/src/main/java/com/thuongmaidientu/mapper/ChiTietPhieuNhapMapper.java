package com.thuongmaidientu.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.thuongmaidientu.dto.ChiTietPhieuNhapDTO;
import com.thuongmaidientu.dto.request.ChiTietPhieuNhapRequest;
import com.thuongmaidientu.dto.response.ChiTietPhieuNhapResponse;
import com.thuongmaidientu.entity.ChiTietPhieuNhapEntity;

@Mapper(componentModel = "spring")
public interface ChiTietPhieuNhapMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "phieunhap", ignore = true)
    @Mapping(target = "phienBanSanPhamNhap", ignore = true)
    ChiTietPhieuNhapEntity toEntity(ChiTietPhieuNhapRequest request);

    @Mapping(target = "maPhieuNhap", source = "id.maPhieuNhap")
    @Mapping(target = "maPhienBanSP", source = "id.maPhienBanSP")
    ChiTietPhieuNhapResponse toResponse(ChiTietPhieuNhapEntity entity);

    @Mapping(target = "phieunhapId", source = "id.maPhieuNhap")
    @Mapping(target = "phienBanSanPhamNhapId", source = "id.maPhienBanSP")
    ChiTietPhieuNhapDTO toDTO(ChiTietPhieuNhapEntity entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "phieunhap", ignore = true)
    @Mapping(target = "phienBanSanPhamNhap", ignore = true)
    ChiTietPhieuNhapEntity toEntity(ChiTietPhieuNhapDTO dto);
}
