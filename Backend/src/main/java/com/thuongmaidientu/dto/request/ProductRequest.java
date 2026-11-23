package com.thuongmaidientu.dto.request;

import java.util.Map;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {
    private Integer id;
    @NotBlank(message = "Tên sản phẩm không được để trống")
    private String tenSanPham;
    private String alias;
    private String hinhAnh;
    private Integer xuatXuId;
    private Integer thuongHieuId;
    private Integer khuVucKhoId;
    private Integer soLuongNhap;
    private Integer soLuongBan;
    private String promo;
    private String sortDesc;
    private String detail;
    private Double tongSao;
    private Integer soLuongDanhGia;
    private Integer status;
    private String trash;

    // Technical specs phẳng
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
