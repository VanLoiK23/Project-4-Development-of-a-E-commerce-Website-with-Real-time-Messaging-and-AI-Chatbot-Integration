package com.thuongmaidientu.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KhuVucKhoResponse {
    private Integer maKhuVuc;
    private String tenKhuVuc;
    private String ghiChu;
    private Integer status;
    private String trash;
    private java.util.Date deleteAt;
}
