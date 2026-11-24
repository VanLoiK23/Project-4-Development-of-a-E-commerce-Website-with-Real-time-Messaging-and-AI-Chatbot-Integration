package com.thuongmaidientu.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.thuongmaidientu.dto.CartDTO;
import com.thuongmaidientu.dto.request.CartRequest;
import com.thuongmaidientu.dto.response.CartResponse;
import com.thuongmaidientu.entity.CartEntity;

@Mapper(componentModel = "spring")
public interface CartMapper {

    @Mapping(target = "khachHang", ignore = true)
    @Mapping(target = "cart", ignore = true)
    CartEntity toEntity(CartRequest request);

    @Mapping(target = "idkh", source = "khachHang.maKhachHang")
    CartResponse toResponse(CartEntity entity);

    @Mapping(target = "idkh", source = "khachHang.maKhachHang")
    @Mapping(target = "cartItems", ignore = true)
    CartDTO toDTO(CartEntity entity);

    @Mapping(target = "khachHang", ignore = true)
    @Mapping(target = "cart", ignore = true)
    CartEntity toEntity(CartDTO dto);
}
