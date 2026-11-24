package com.thuongmaidientu.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.thuongmaidientu.dto.CategoryDTO;
import com.thuongmaidientu.dto.request.CategoryRequest;
import com.thuongmaidientu.dto.response.CategoryResponse;
import com.thuongmaidientu.entity.CategoryEntity;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    @Mapping(target = "brands", ignore = true)
    CategoryEntity toEntity(CategoryRequest request);

    CategoryResponse toResponse(CategoryEntity entity);

    @Mapping(target = "id", source = "maThuongHieu")
    CategoryDTO toDTO(CategoryEntity entity);

    @Mapping(target = "maThuongHieu", source = "id")
    @Mapping(target = "brands", ignore = true)
    CategoryEntity toEntity(CategoryDTO dto);
}
