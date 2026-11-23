package com.thuongmaidientu.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.thuongmaidientu.dto.PhienBanSanPhamDTO;
import com.thuongmaidientu.dto.request.PhienBanSanPhamRequest;
import com.thuongmaidientu.dto.response.PhienBanSanPhamResponse;
import com.thuongmaidientu.entity.PhienBanSanPhamEntity;

@Mapper(componentModel = "spring")
public interface PhienBanSanPhamMapper {

    @Mapping(target = "sanPham", ignore = true)
    @Mapping(target = "rom", ignore = true)
    @Mapping(target = "ram", ignore = true)
    @Mapping(target = "mauSac", ignore = true)
    @Mapping(target = "phienbansanphamCartitem", ignore = true)
    @Mapping(target = "phienbansanphamChiTietPhieuNhap", ignore = true)
    @Mapping(target = "phienbansanphamChiTietPhieuXuat", ignore = true)
    @Mapping(target = "phienbanspListImei", ignore = true)
    PhienBanSanPhamEntity toEntity(PhienBanSanPhamRequest request);

    @Mapping(target = "masp", source = "sanPham.id")
    @Mapping(target = "romId", source = "rom.maDungLuongRom")
    @Mapping(target = "ramId", source = "ram.maDungLuongRam")
    @Mapping(target = "mausacId", source = "mauSac.maMauSac")
    PhienBanSanPhamResponse toResponse(PhienBanSanPhamEntity entity);

    @Mapping(target = "maPhienbansanpham", source = "maPhienBanSP")
    @Mapping(target = "maSanpham", source = "sanPham.id")
    @Mapping(target = "color", source = "mauSac.tenMauSac")
    @Mapping(target = "colorId", source = "mauSac.maMauSac")
    @Mapping(target = "ram", ignore = true)
    @Mapping(target = "ramId", ignore = true)
    @Mapping(target = "rom", ignore = true)
    @Mapping(target = "romId", ignore = true)
    PhienBanSanPhamDTO toDTO(PhienBanSanPhamEntity entity);

    @Mapping(target = "maPhienBanSP", source = "maPhienbansanpham")
    @Mapping(target = "sanPham", ignore = true)
    @Mapping(target = "rom", ignore = true)
    @Mapping(target = "ram", ignore = true)
    @Mapping(target = "mauSac", ignore = true)
    @Mapping(target = "phienbansanphamCartitem", ignore = true)
    @Mapping(target = "phienbansanphamChiTietPhieuNhap", ignore = true)
    @Mapping(target = "phienbansanphamChiTietPhieuXuat", ignore = true)
    @Mapping(target = "phienbanspListImei", ignore = true)
    PhienBanSanPhamEntity toEntity(PhienBanSanPhamDTO dto);
}
