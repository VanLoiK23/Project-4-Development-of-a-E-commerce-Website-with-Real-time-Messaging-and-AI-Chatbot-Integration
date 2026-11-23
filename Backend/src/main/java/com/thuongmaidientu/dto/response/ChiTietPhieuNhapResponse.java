package com.thuongmaidientu.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChiTietPhieuNhapResponse {
    private Integer maPhieuNhap;
    private Integer maPhienBanSP;
    private Integer soLuong;
    private Integer donGia;
}
