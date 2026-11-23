package com.thuongmaidientu.mapper;

import org.mapstruct.Mapper;

import com.thuongmaidientu.dto.DiscountDTO;
import com.thuongmaidientu.dto.request.DiscountRequest;
import com.thuongmaidientu.dto.response.DiscountResponse;
import com.thuongmaidientu.entity.DiscountEntity;

@Mapper(componentModel = "spring")
public interface DiscountMapper {

    DiscountEntity toEntity(DiscountRequest request);

    DiscountResponse toResponse(DiscountEntity entity);

    DiscountDTO toDTO(DiscountEntity entity);

    DiscountEntity toEntity(DiscountDTO dto);
}
