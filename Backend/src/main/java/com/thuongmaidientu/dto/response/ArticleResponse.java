package com.thuongmaidientu.dto.response;

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
    private String sortDesc;
    private String image;
    private String details;
    private java.util.Date createAt;
    private Integer status;
    private String trash;
    private java.util.Date deletedAt;
}
