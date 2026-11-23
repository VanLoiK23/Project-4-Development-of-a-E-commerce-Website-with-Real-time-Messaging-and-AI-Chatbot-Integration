package com.thuongmaidientu.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.thuongmaidientu.dto.VNPayDTO;
import com.thuongmaidientu.dto.request.VNPayRequest;
import com.thuongmaidientu.dto.response.VNPayResponse;
import com.thuongmaidientu.entity.VNPayEntity;

@Mapper(componentModel = "spring")
public interface VNPayMapper {

    VNPayEntity toEntity(VNPayRequest request);

    VNPayResponse toResponse(VNPayEntity entity);

    @Mapping(target = "vnp_Amount", source = "amount")
    @Mapping(target = "vnp_OrderInfo", source = "orderInfo")
    @Mapping(target = "vnp_OrderType", source = "orderType")
    @Mapping(target = "vnp_CardType", source = "payType")
    @Mapping(target = "vnp_TransactionNo", source = "transId")
    VNPayDTO toDTO(VNPayEntity entity);

    @Mapping(target = "amount", source = "vnp_Amount")
    @Mapping(target = "orderInfo", source = "vnp_OrderInfo")
    @Mapping(target = "orderType", source = "vnp_OrderType")
    @Mapping(target = "payType", source = "vnp_CardType")
    @Mapping(target = "transId", source = "vnp_TransactionNo")
    VNPayEntity toEntity(VNPayDTO dto);
}
