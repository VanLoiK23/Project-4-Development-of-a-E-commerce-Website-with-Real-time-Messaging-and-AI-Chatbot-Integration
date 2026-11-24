package com.thuongmaidientu.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CTPhieuNhapRequest {
    private Integer maPhieuNhap;
    private Integer maPhienBanSP;
    private Integer soLuong;
    private Integer donGia;
}
