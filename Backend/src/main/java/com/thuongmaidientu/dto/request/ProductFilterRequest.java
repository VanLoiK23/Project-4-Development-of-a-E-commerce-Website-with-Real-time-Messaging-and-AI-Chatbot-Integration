package com.thuongmaidientu.dto.request;

import java.util.List;

import lombok.Data;

@Data
public class ProductFilterRequest {

    private String keyword;

    private String collection;

    private List<String> brands;      
    private List<String> os;              // android | ios                       (specs.os)
    private List<String> resolutions;     // HD_PLUS | FULL_HD_PLUS | QHD_1_5K | QHD_2K_PLUS (specs.resolution_w)
    private List<Integer> refreshRates;   // 60, 90, 120, 144, 165               (specs.refresh_hz)
    private List<String> charging;        // FAST_20W | SUPER_FAST_60W           (specs.charge_w)
    private List<String> quickTags;       // BATTERY_7000 | CAMERA_200MP | IP68  (AND giữa các tag)
    private List<String> panels;          // IPS LCD, AMOLED, ...                (specs.panel)

    private Boolean has5g;
    private Boolean nfc;
    private Boolean ois;
    private Boolean expandableStorage;
    private Boolean headphoneJack;
    private Boolean stereoSpeaker;

    private Integer priceMin;             
    private Integer priceMax;
    private List<Integer> ramGb;         
    private List<Integer> storageGb;    

    private String sort = "popular";      // popular | newest | reviews | price_asc | price_desc
    private int page = 0;                 // 0-based
}