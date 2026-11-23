package com.thuongmaidientu.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.thuongmaidientu.dto.RamDTO;
import com.thuongmaidientu.dto.request.RamRequest;
import com.thuongmaidientu.dto.response.RamResponse;
import com.thuongmaidientu.entity.RamEntity;

@Mapper(componentModel = "spring")
public interface RamMapper {

    @Mapping(target = "rams", ignore = true)
    RamEntity toEntity(RamRequest request);

    RamResponse toResponse(RamEntity entity);

    @Mapping(target = "id", source = "maDungLuongRam")
    RamDTO toDTO(RamEntity entity);

    @Mapping(target = "maDungLuongRam", source = "id")
    @Mapping(target = "rams", ignore = true)
    RamEntity toEntity(RamDTO dto);
}
