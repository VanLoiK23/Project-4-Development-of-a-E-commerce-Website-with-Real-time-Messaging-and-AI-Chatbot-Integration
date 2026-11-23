package com.thuongmaidientu.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.thuongmaidientu.dto.RomDTO;
import com.thuongmaidientu.dto.request.RomRequest;
import com.thuongmaidientu.dto.response.RomResponse;
import com.thuongmaidientu.entity.RomEntity;

@Mapper(componentModel = "spring")
public interface RomMapper {

    @Mapping(target = "roms", ignore = true)
    RomEntity toEntity(RomRequest request);

    RomResponse toResponse(RomEntity entity);

    @Mapping(target = "id", source = "maDungLuongRom")
    RomDTO toDTO(RomEntity entity);

    @Mapping(target = "maDungLuongRom", source = "id")
    @Mapping(target = "roms", ignore = true)
    RomEntity toEntity(RomDTO dto);
}
