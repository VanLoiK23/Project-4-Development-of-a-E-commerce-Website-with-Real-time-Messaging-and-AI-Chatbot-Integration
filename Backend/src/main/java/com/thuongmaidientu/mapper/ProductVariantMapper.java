package com.thuongmaidientu.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.thuongmaidientu.dto.PhienBanSanPhamDTO;
import com.thuongmaidientu.dto.request.ProductVariantRequest;
import com.thuongmaidientu.dto.response.ProductVariantResponse;
import com.thuongmaidientu.entity.ProductVariantEntity;

@Mapper(componentModel = "spring")
public interface ProductVariantMapper {

    @Mapping(target = "sanPham", ignore = true)
    @Mapping(target = "rom", ignore = true)
    @Mapping(target = "ram", ignore = true)
    @Mapping(target = "mauSac", ignore = true)
    @Mapping(target = "phienbansanphamCartitem", ignore = true)
    @Mapping(target = "phienbansanphamChiTietPhieuNhap", ignore = true)
    @Mapping(target = "phienbansanphamChiTietPhieuXuat", ignore = true)
    @Mapping(target = "phienbanspListImei", ignore = true)
    ProductVariantEntity toEntity(ProductVariantRequest request);

    @Mapping(target = "masp", source = "sanPham.id")
    @Mapping(target = "romId", source = "rom.maDungLuongRom")
    @Mapping(target = "ramId", source = "ram.maDungLuongRam")
    @Mapping(target = "mausacId", source = "mauSac.maMauSac")
    ProductVariantResponse toResponse(ProductVariantEntity entity);

    @Mapping(target = "maPhienbansanpham", source = "maPhienBanSP")
    @Mapping(target = "maSanpham", source = "sanPham.id")
    @Mapping(target = "color", source = "mauSac.tenMauSac")
    @Mapping(target = "colorId", source = "mauSac.maMauSac")
    @Mapping(target = "ram", ignore = true)
    @Mapping(target = "ramId", ignore = true)
    @Mapping(target = "rom", ignore = true)
    @Mapping(target = "romId", ignore = true)
    PhienBanSanPhamDTO toDTO(ProductVariantEntity entity);

    @Mapping(target = "maPhienBanSP", source = "maPhienbansanpham")
    @Mapping(target = "sanPham", ignore = true)
    @Mapping(target = "rom", ignore = true)
    @Mapping(target = "ram", ignore = true)
    @Mapping(target = "mauSac", ignore = true)
    @Mapping(target = "phienbansanphamCartitem", ignore = true)
    @Mapping(target = "phienbansanphamChiTietPhieuNhap", ignore = true)
    @Mapping(target = "phienbansanphamChiTietPhieuXuat", ignore = true)
    @Mapping(target = "phienbanspListImei", ignore = true)
    ProductVariantEntity toEntity(PhienBanSanPhamDTO dto);
}
