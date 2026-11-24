package com.thuongmaidientu.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RamRequest {
    private Integer maDungLuongRam;
    private Integer kichThuocRam;
    private Integer status;
    private String trash;
    private java.util.Date deletedAt;
}
