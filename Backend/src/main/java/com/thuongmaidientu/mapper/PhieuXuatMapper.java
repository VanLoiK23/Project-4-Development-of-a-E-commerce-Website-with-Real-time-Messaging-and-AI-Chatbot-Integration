package com.thuongmaidientu.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.thuongmaidientu.dto.PhieuXuatDTO;
import com.thuongmaidientu.dto.request.PhieuXuatRequest;
import com.thuongmaidientu.dto.response.PhieuXuatResponse;
import com.thuongmaidientu.entity.PhieuXuatEntity;

@Mapper(componentModel = "spring")
public interface PhieuXuatMapper {

    @Mapping(target = "khachHangMua", ignore = true)
    @Mapping(target = "phieuxuatList", ignore = true)
    @Mapping(target = "phieunhapCTSP", ignore = true)
    @Mapping(target = "listComment", ignore = true)
    PhieuXuatEntity toEntity(PhieuXuatRequest request);

    @Mapping(target = "makh", source = "khachHangMua.maKhachHang")
    PhieuXuatResponse toResponse(PhieuXuatEntity entity);

    @Mapping(target = "IDKhachHang", source = "khachHangMua.maKhachHang")
    @Mapping(target = "makh", source = "khachHangMua.maKhachHang")
    @Mapping(target = "khachHangName", source = "khachHangMua.hoTen")
    @Mapping(target = "sdt", source = "khachHangMua.soDienThoai")
    @Mapping(target = "date", source = "thoiGian")
    PhieuXuatDTO toDTO(PhieuXuatEntity entity);

    @Mapping(target = "khachHangMua", ignore = true)
    @Mapping(target = "phieuxuatList", ignore = true)
    @Mapping(target = "phieunhapCTSP", ignore = true)
    @Mapping(target = "listComment", ignore = true)
    PhieuXuatEntity toEntity(PhieuXuatDTO dto);
}
