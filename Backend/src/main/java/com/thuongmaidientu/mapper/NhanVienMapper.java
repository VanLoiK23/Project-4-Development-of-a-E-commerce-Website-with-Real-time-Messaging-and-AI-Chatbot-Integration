package com.thuongmaidientu.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.thuongmaidientu.dto.NhanVienDTO;
import com.thuongmaidientu.dto.request.NhanVienRequest;
import com.thuongmaidientu.dto.response.NhanVienResponse;
import com.thuongmaidientu.entity.NhanVienEntity;

@Mapper(componentModel = "spring")
public interface NhanVienMapper {

    @Mapping(target = "listPhieuNhapCreate", ignore = true)
    NhanVienEntity toEntity(NhanVienRequest request);

    NhanVienResponse toResponse(NhanVienEntity entity);

    NhanVienDTO toDTO(NhanVienEntity entity);

    @Mapping(target = "listPhieuNhapCreate", ignore = true)
    NhanVienEntity toEntity(NhanVienDTO dto);
}
