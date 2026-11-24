package com.thuongmaidientu.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.thuongmaidientu.dto.PhieuNhapDTO;
import com.thuongmaidientu.dto.request.PhieuNhapRequest;
import com.thuongmaidientu.dto.response.PhieuNhapResponse;
import com.thuongmaidientu.entity.PhieuNhapEntity;

@Mapper(componentModel = "spring")
public interface PhieuNhapMapper {

    @Mapping(target = "nhaCungCap", ignore = true)
    @Mapping(target = "nguoiTaoPhieu", ignore = true)
    @Mapping(target = "phieunhapList", ignore = true)
    @Mapping(target = "phieunhapCTSP", ignore = true)
    PhieuNhapEntity toEntity(PhieuNhapRequest request);

    @Mapping(target = "maNhaCungCap", source = "nhaCungCap.id")
    @Mapping(target = "nguoiTaoPhieuNhap", source = "nguoiTaoPhieu.id")
    PhieuNhapResponse toResponse(PhieuNhapEntity entity);

    @Mapping(target = "nguoiTaoPhieuId", source = "nguoiTaoPhieu.id")
    @Mapping(target = "nguoiTaoPhieuName", source = "nguoiTaoPhieu.hoTen")
    @Mapping(target = "nhaCungCapID", source = "nhaCungCap.id")
    @Mapping(target = "nhaCungCapName", source = "nhaCungCap.tenNhaCungCap")
    @Mapping(target = "address", source = "nhaCungCap.diaChi")
    PhieuNhapDTO toDTO(PhieuNhapEntity entity);

    @Mapping(target = "nguoiTaoPhieu", ignore = true)
    @Mapping(target = "nhaCungCap", ignore = true)
    @Mapping(target = "phieunhapList", ignore = true)
    @Mapping(target = "phieunhapCTSP", ignore = true)
    PhieuNhapEntity toEntity(PhieuNhapDTO dto);
}
