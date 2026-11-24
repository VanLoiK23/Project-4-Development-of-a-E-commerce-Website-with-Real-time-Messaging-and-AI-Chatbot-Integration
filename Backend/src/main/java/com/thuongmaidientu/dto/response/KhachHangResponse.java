package com.thuongmaidientu.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KhachHangResponse {
    private Integer maKhachHang;
    private String hoTen;
    private String gioiTinh;
    private java.util.Date ngaySinh;
    private String soDienThoai;
    private String diaChi;
    private String email;
    private Integer trangThai;
}
