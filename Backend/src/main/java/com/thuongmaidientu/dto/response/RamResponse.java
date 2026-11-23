package com.thuongmaidientu.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RamResponse {
    private Integer maDungLuongRam;
    private Integer kichThuocRam;
    private Integer status;
    private String trash;
    private java.util.Date deletedAt;
}
