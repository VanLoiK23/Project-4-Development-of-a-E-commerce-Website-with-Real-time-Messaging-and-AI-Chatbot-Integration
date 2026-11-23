package com.thuongmaidientu.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.thuongmaidientu.dto.CommentAndRateDTO;
import com.thuongmaidientu.dto.request.CommentAndRateRequest;
import com.thuongmaidientu.dto.response.CommentAndRateResponse;
import com.thuongmaidientu.entity.CommentAndRateEntity;

@Mapper(componentModel = "spring")
public interface CommentAndRateMapper {

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "order", ignore = true)
    CommentAndRateEntity toEntity(CommentAndRateRequest request);

    @Mapping(target = "idUser", source = "user.maKhachHang")
    @Mapping(target = "idSp", source = "product.id")
    @Mapping(target = "orderId", source = "order.id")
    CommentAndRateResponse toResponse(CommentAndRateEntity entity);

    @Mapping(target = "id_user", source = "user.maKhachHang")
    @Mapping(target = "hoten", source = "user.hoTen")
    @Mapping(target = "id_sp", source = "product.id")
    @Mapping(target = "tensp", source = "product.tenSanPham")
    @Mapping(target = "order_id", source = "order.id")
    @Mapping(target = "feeback", source = "feedback")
    @Mapping(target = "nhanvien", source = "nhanVien")
    @Mapping(target = "ngayPH", source = "ngayPhanHoi")
    CommentAndRateDTO toDTO(CommentAndRateEntity entity);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "order", ignore = true)
    @Mapping(target = "feedback", source = "feeback")
    @Mapping(target = "nhanVien", source = "nhanvien")
    @Mapping(target = "ngayPhanHoi", source = "ngayPH")
    CommentAndRateEntity toEntity(CommentAndRateDTO dto);
}
