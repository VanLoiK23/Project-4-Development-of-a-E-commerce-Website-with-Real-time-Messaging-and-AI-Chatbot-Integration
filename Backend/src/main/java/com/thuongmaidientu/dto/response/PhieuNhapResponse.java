package com.thuongmaidientu.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PhieuNhapResponse {
    private Integer id;
    private java.util.Date thoiGian;
    private Integer maNhaCungCap;
    private Integer nguoiTaoPhieuNhap;
    private java.math.BigDecimal tongTien;
    private String save;
}
