package com.thuongmaidientu.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariantResponse {
    private Integer maPhienBanSP;
    private Integer masp;
    private Integer romId;
    private String romLabel;
    private Integer ramId;
    private String ramLabel;
    private Integer mausacId;

    @JsonProperty("colorName")
    private String tenMauSac;

    private Integer giaNhap;

    @JsonProperty("originalPrice")
    private Integer giaXuat;

    @JsonProperty("stockQuantity")
    private Integer soLuongTon;

    private Double sale;

    @JsonProperty("price")
    private Integer priceSale;

    @JsonProperty("discountPercent")
    private Integer discountPercent;

    @JsonProperty("inStock")
    private Boolean inStock;
}