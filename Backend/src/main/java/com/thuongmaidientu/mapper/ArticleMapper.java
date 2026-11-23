package com.thuongmaidientu.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.thuongmaidientu.dto.ArticleDTO;
import com.thuongmaidientu.dto.request.ArticleRequest;
import com.thuongmaidientu.dto.response.ArticleResponse;
import com.thuongmaidientu.entity.ArticleEntity;

@Mapper(componentModel = "spring")
public interface ArticleMapper {

    @Mapping(target = "listComment", ignore = true)
    ArticleEntity toEntity(ArticleRequest request);

    ArticleResponse toResponse(ArticleEntity entity);

    @Mapping(target = "createdDate", source = "createAt")
    @Mapping(target = "listComment", ignore = true)
    ArticleDTO toDTO(ArticleEntity entity);

    @Mapping(target = "createAt", source = "createdDate")
    @Mapping(target = "listComment", ignore = true)
    ArticleEntity toEntity(ArticleDTO dto);
}
