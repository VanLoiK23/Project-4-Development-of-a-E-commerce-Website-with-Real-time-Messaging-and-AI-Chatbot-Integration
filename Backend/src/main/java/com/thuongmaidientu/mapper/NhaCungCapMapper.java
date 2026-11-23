package com.thuongmaidientu.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.thuongmaidientu.dto.NhaCungCapDTO;
import com.thuongmaidientu.dto.request.NhaCungCapRequest;
import com.thuongmaidientu.dto.response.NhaCungCapResponse;
import com.thuongmaidientu.entity.NhaCungCapEntity;

@Mapper(componentModel = "spring")
public interface NhaCungCapMapper {

    @Mapping(target = "listProductProvide", ignore = true)
    NhaCungCapEntity toEntity(NhaCungCapRequest request);

    NhaCungCapResponse toResponse(NhaCungCapEntity entity);

    NhaCungCapDTO toDTO(NhaCungCapEntity entity);

    @Mapping(target = "listProductProvide", ignore = true)
    NhaCungCapEntity toEntity(NhaCungCapDTO dto);
}
