package com.thuongmaidientu.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.thuongmaidientu.dto.ThongTinGiaoHangDTO;
import com.thuongmaidientu.dto.request.ThongTinGiaoHangRequest;
import com.thuongmaidientu.dto.response.ThongTinGiaoHangResponse;
import com.thuongmaidientu.entity.ThongTinGiaoHangEntity;

@Mapper(componentModel = "spring")
public interface ThongTinGiaoHangMapper {

    @Mapping(target = "khachHangDat", ignore = true)
    ThongTinGiaoHangEntity toEntity(ThongTinGiaoHangRequest request);

    @Mapping(target = "idKh", source = "khachHangDat.maKhachHang")
    ThongTinGiaoHangResponse toResponse(ThongTinGiaoHangEntity entity);

    @Mapping(target = "idkh", source = "khachHangDat.maKhachHang")
    ThongTinGiaoHangDTO toDTO(ThongTinGiaoHangEntity entity);

    @Mapping(target = "khachHangDat", ignore = true)
    ThongTinGiaoHangEntity toEntity(ThongTinGiaoHangDTO dto);
}
