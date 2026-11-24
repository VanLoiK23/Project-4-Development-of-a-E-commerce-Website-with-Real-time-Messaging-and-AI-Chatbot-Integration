package com.thuongmaidientu.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.thuongmaidientu.dto.CommentProductDTO;
import com.thuongmaidientu.dto.request.CommentProductRequest;
import com.thuongmaidientu.dto.response.CommentProductResponse;
import com.thuongmaidientu.entity.CommentProductEntity;

@Mapper(componentModel = "spring")
public interface CommentProductMapper {

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "order", ignore = true)
    CommentProductEntity toEntity(CommentProductRequest request);

    @Mapping(target = "idUser", source = "user.maKhachHang")
    @Mapping(target = "idSp", source = "product.id")
    @Mapping(target = "orderId", source = "order.id")
    CommentProductResponse toResponse(CommentProductEntity entity);

    @Mapping(target = "id_user", source = "user.maKhachHang")
    @Mapping(target = "hoten", source = "user.hoTen")
    @Mapping(target = "id_sp", source = "product.id")
    @Mapping(target = "tensp", source = "product.tenSanPham")
    @Mapping(target = "order_id", source = "order.id")
    @Mapping(target = "feeback", source = "feedback")
    @Mapping(target = "nhanvien", source = "nhanVien")
    @Mapping(target = "ngayPH", source = "ngayPhanHoi")
    CommentProductDTO toDTO(CommentProductEntity entity);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "order", ignore = true)
    @Mapping(target = "feedback", source = "feeback")
    @Mapping(target = "nhanVien", source = "nhanvien")
    @Mapping(target = "ngayPhanHoi", source = "ngayPH")
    CommentProductEntity toEntity(CommentProductDTO dto);
}
