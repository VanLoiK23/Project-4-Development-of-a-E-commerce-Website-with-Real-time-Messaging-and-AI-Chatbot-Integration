package com.thuongmaidientu.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.thuongmaidientu.dto.CommentArticleDTO;
import com.thuongmaidientu.dto.request.CommentArticleRequest;
import com.thuongmaidientu.dto.response.CommentArticleResponse;
import com.thuongmaidientu.entity.CommentArticleEntity;

@Mapper(componentModel = "spring")
public interface CommentArticleMapper {

    @Mapping(target = "kh", ignore = true)
    @Mapping(target = "article", ignore = true)
    CommentArticleEntity toEntity(CommentArticleRequest request);

    @Mapping(target = "idUser", source = "kh.maKhachHang")
    @Mapping(target = "idArticles", source = "article.id")
    CommentArticleResponse toResponse(CommentArticleEntity entity);

    @Mapping(target = "idClient", source = "kh.maKhachHang")
    @Mapping(target = "nameClient", source = "kh.hoTen")
    @Mapping(target = "idArticle", source = "article.id")
    @Mapping(target = "nameArticle", source = "article.title")
    CommentArticleDTO toDTO(CommentArticleEntity entity);

    @Mapping(target = "kh", ignore = true)
    @Mapping(target = "article", ignore = true)
    CommentArticleEntity toEntity(CommentArticleDTO dto);
}
