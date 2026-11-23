package com.thuongmaidientu.dto.response;

import java.util.Date;
import java.util.Map;
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
    private String tenSanPham;
    private String alias;
    private String hinhAnh;
    private Integer xuatXuId;
    private String tenXuatXu;
    private Integer thuongHieuId;
    private String tenThuongHieu;
    private Integer khuVucKhoId;
    private String tenKhuVucKho;
    private Integer soLuongNhap;
    private Integer soLuongBan;
    private String promo;
    private String sortDesc;
    private String detail;
    private Double tongSao;
    private Integer soLuongDanhGia;
    private Double diemTrungBinhSao;
    private Date created;
    private String createdBy;
    private Date modified;
    private String modifiedBy;
    private String trash;
    private Integer status;

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
