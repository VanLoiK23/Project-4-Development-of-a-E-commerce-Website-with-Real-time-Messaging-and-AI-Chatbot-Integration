package com.thuongmaidientu.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class CommentAndRateDTO extends AbstractDTO<CommentAndRateDTO> {

    @JsonProperty("external_review_id")
    private String externalReviewId;

    private String content;

    private Double rate;

    private String img;

    @JsonProperty("has_media")
    private Integer hasMedia = 0;

    @JsonProperty("helpful_count")
    private Integer helpfulCount = 0;

    @JsonProperty("variant_label")
    private String variantLabel;

    @JsonProperty("user_hash")
    private String userHash;

    private Integer verified = 0;

    private String source = "web";

    @JsonProperty("scraped_at")
    private Date scrapedAt;

    @JsonProperty("absa_aspects")
    private Object absaAspects;

    private Integer id_user;

    @JsonProperty("user")
    private String hoten;

    private Integer id_sp;
    private String tensp;

    private Integer feeback = 0;

    @JsonProperty("feeback_content")
    private String feedbackContent;

    private String nhanvien;

    private Date ngayPH;

    private String ngayphanhoi;

    private Integer order_id;

    private Date ngayDanhGia;

    private String ngay_đanhgia;

}
