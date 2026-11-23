package com.thuongmaidientu.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartResponse {
    private Integer id;
    private Integer idkh;
    private java.util.Date createdAt;
    private java.util.Date updatedAt;
    private String status;
}
