package com.thuongmaidientu.dto;

import java.util.List;
import java.util.Map;

import lombok.Data;

@Data
public class RequestProductInteraction {

	private Integer id;
	private String name;
	private String img;
	private Integer xuatxu;
	private Integer hedieuhanh;
	private Integer thuonghieu;
	private Integer khuvuckho;
	private Integer giamgia;
	private Integer giare;
	private Integer dungluongpin;
	private String cameratruoc;
	private String camerasau;
	private Integer phienbanHDH;
	private String manhinh;
	private String title;
	private String description;
	private Boolean isTragop;
	private List<ProductVariant> listPB;

	// specs JSONB và 21 trường cấu hình phẳng bổ sung
	private Map<String, Object> specs;
	private String os;
	private Integer releaseYear;
	private String chipset;
	private Boolean expandableStorage;
	private Integer batteryMah;
	private Double chargeW;
	private Double screenInch;
	private Integer resolutionW;
	private Integer resolutionH;
	private String panel;
	private Integer refreshHz;
	private Integer brightnessNitsPeak;
	private Double rearMainMp;
	private Boolean ois;
	private Double weightG;
	private String ipRating;
	private Boolean nfc;
	private Boolean has5g;
	private String wifiGen;
	private Boolean stereoSpeaker;
	private Boolean headphoneJack;

}
