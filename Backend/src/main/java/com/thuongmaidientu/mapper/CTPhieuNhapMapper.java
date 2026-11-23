package com.thuongmaidientu.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.thuongmaidientu.dto.CTPhieuNhapDTO;
import com.thuongmaidientu.dto.request.CTPhieuNhapRequest;
import com.thuongmaidientu.dto.response.CTPhieuNhapResponse;
import com.thuongmaidientu.entity.CTPhieuNhap;

@Mapper(componentModel = "spring")
public interface CTPhieuNhapMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "phieunhap", ignore = true)
    @Mapping(target = "phienBanSanPhamNhap", ignore = true)
    CTPhieuNhap toEntity(CTPhieuNhapRequest request);

    @Mapping(target = "maPhieuNhap", source = "id.maPhieuNhap")
    @Mapping(target = "maPhienBanSP", source = "id.maPhienBanSP")
    CTPhieuNhapResponse toResponse(CTPhieuNhap entity);

    @Mapping(target = "phieunhapId", source = "id.maPhieuNhap")
    @Mapping(target = "phienBanSanPhamNhapId", source = "id.maPhienBanSP")
    CTPhieuNhapDTO toDTO(CTPhieuNhap entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "phieunhap", ignore = true)
    @Mapping(target = "phienBanSanPhamNhap", ignore = true)
    CTPhieuNhap toEntity(CTPhieuNhapDTO dto);
}
