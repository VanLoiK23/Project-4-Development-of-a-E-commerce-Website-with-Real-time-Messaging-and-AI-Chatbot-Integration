package com.thuongmaidientu.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartRequest {
    private Integer id;
    private Integer idkh;
    private java.util.Date createdAt;
    private java.util.Date updatedAt;
    private String status;
}
