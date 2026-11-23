package com.thuongmaidientu.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentArticleRequest {
    private Integer id;
    private String content;
    private Double rating;
    private Integer idUser;
    private Integer idArticles;
    private Integer feedback;
    private String contentFeedback;
    private String nhanVien;
    private java.util.Date ngayDanhGia;
    private java.util.Date ngayPhanHoi;
}
