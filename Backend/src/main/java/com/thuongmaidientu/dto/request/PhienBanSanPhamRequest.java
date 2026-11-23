package com.thuongmaidientu.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PhienBanSanPhamRequest {
    private Integer maPhienBanSP;
    private Integer masp;
    private Integer romId;
    private Integer ramId;
    private Integer mausacId;
    private Integer giaNhap;
    private Integer giaXuat;
    private Integer soLuongTon;
    private Double sale;
    private Integer priceSale;
}
