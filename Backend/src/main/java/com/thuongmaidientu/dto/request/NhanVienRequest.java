package com.thuongmaidientu.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NhanVienRequest {
    private Integer id;
    private String hoTen;
    private String matKhau;
    private String gioiTinh;
    private java.util.Date ngaySinh;
    private String soDienThoai;
    private String diaChi;
    private String email;
    private Integer trangThai;
}
