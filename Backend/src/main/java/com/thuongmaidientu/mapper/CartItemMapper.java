package com.thuongmaidientu.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.thuongmaidientu.dto.CartItemDTO;
import com.thuongmaidientu.dto.request.CartItemRequest;
import com.thuongmaidientu.dto.response.CartItemResponse;
import com.thuongmaidientu.entity.CartItemEntity;

@Mapper(componentModel = "spring")
public interface CartItemMapper {

    @Mapping(target = "idCart", ignore = true)
    @Mapping(target = "phienbansanpham", ignore = true)
    CartItemEntity toEntity(CartItemRequest request);

    @Mapping(target = "cartId", source = "idCart.id")
    @Mapping(target = "maPhienBanSp", source = "phienbansanpham.maPhienBanSP")
    CartItemResponse toResponse(CartItemEntity entity);

    @Mapping(target = "cart_item_id", source = "id")
    @Mapping(target = "cart_id", source = "idCart.id")
    @Mapping(target = "maphienbansp", source = "phienbansanpham.maPhienBanSP")
    @Mapping(target = "masp", source = "phienbansanpham.sanPham.id")
    CartItemDTO toDTO(CartItemEntity entity);

    @Mapping(target = "id", source = "cart_item_id")
    @Mapping(target = "idCart", ignore = true)
    @Mapping(target = "phienbansanpham", ignore = true)
    CartItemEntity toEntity(CartItemDTO dto);
}
