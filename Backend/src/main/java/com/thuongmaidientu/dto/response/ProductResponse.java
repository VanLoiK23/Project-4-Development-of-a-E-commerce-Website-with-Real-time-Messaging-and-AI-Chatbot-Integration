package com.thuongmaidientu.dto.response;

import java.util.Date;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {

    private Integer id;

    @JsonProperty("name")
    private String tenSanPham;

    @JsonProperty("slug")
    private String alias;

    private String hinhAnh; //list hinh anh

    private String image;

    @JsonProperty("brand")
    private String tenThuongHieu;

    private String categoryType;

    @JsonProperty("price")
    private Integer price;

    @JsonProperty("originalPrice")
    private Integer originalPrice;

    @JsonProperty("discountPercent")
    private Integer discountPercent;

    @JsonProperty("stockQuantity")
    private Integer stockQuantity;

    @JsonProperty("soldCount")
    private Integer soLuongBan;

    @JsonProperty("reviewCount")
    private Integer soLuongDanhGia;

    @JsonProperty("inStock")
    private Boolean inStock;

    private List<String> keySpecs;
    private List<String> highlights;
    private Map<String, Object> specsFilter;
    private Map<String, Object> absaOverall;
    private List<Map<String, Object>> aspects;

    @JsonProperty("collections")
    private List<String> collections;

    @JsonProperty("variants")
    private List<ProductVariantResponse> variants;

    // Các trường dữ liệu gốc / chi tiết
    private Integer xuatXuId;
    private String tenXuatXu;
    private Integer thuongHieuId;
    private Integer khuVucKhoId;
    private String tenKhuVucKho;
    private Integer soLuongNhap;
    private String promo;
    private String sortDesc;
    private String detail;
    private Double tongSao;
    private Double diemTrungBinhSao;
    private Date created;
    private String createdBy;
    private Date modified;
    private String modifiedBy;
    private String trash;
    private Integer status;

    private String os;
    private Integer releaseYear;
    private String chipset;
    private Boolean expandableStorage;
    private Integer batteryMah;
    private Double chargeW;
    private Double screenInch;
    private Integer resolutionW;
    private Integer resolutionH;
    private String panel;
    private Integer refreshHz;
    private Integer brightnessNitsPeak;
    private Double rearMainMp;
    private Boolean ois;
    private Double weightG;
    private String ipRating;
    private Boolean nfc;
    private Boolean has5g;
    private String wifiGen;
    private Boolean stereoSpeaker;
    private Boolean headphoneJack;

    private Map<String, Object> specs;
}