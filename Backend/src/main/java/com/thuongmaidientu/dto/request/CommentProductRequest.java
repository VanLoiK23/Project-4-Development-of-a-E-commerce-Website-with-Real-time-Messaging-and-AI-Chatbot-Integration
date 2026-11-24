package com.thuongmaidientu.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentProductRequest {
    private Integer id;
    private String externalReviewId;
    private String content;
    private Double rate;
    private String img;
    private Integer hasMedia;
    private Integer helpfulCount;
    private String variantLabel;
    private String userHash;
    private Integer verified;
    private String source;
    private java.util.Date scrapedAt;
    private Object absaAspects;
    private Integer idUser;
    private Integer idSp;
    private Integer feedback;
    private String feedbackContent;
    private String nhanVien;
    private java.util.Date ngayPhanHoi;
    private Integer orderId;
    private java.util.Date ngayDanhGia;
}
