package com.thuongmaidientu.dto.response;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArticleResponse {
    private Integer id;
    private String title;
    private String slug;
    @JsonProperty("excerpt")
    private String sortDesc;
    @JsonProperty("cover")
    private String image;
    private String details;
    @JsonProperty("publishedAt")
    private java.util.Date createAt;
    private Integer status;
    private String trash;
    private java.util.Date deletedAt;

    // private List<CommentArticleResponse> listComment;
}
