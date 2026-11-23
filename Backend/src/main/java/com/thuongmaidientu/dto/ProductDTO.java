package com.thuongmaidientu.dto;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonProperty;
import tools.jackson.core.JacksonException;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import lombok.Data;

@Data
public class ProductDTO extends AbstractDTO<ProductDTO> {

	@JsonProperty("tensp")
	private String tenSanPham;
	private String alias;
	@JsonProperty("hinhanh")
	private String hinhAnh;

	private Integer xuatXuId;
	@JsonProperty("xuatxu")
	private String xuatXu;

	@JsonProperty("dungluongpin")
	private Integer dungLuongPin;
	@JsonProperty("manhinh")
	private String manHinh;

	private Integer heDieuHanhId;
	@JsonProperty("hedieuhanh")
	private String heDieuHanh;
	@JsonProperty("phienbanhdh")
	private Double phienBanHDH;
	@JsonProperty("camerasau")
	private String cameraSau;
	@JsonProperty("cameratruoc")
	private String cameraTruoc;
	@JsonProperty("thuonghieu")
	private Integer thuongHieuId;

	private String thuongHieu;

	private Integer status;

	private Integer khuVucKhoId;
	@JsonProperty("khuvuckho")
	private String khuVucKho;
	@JsonProperty("soluongnhap")
	private int soLuongNhap = 0;
	@JsonProperty("soluongban")
	private int soLuongBan = 0;
	private int soLuongCon = 0;

	private int num_trash = 0;

	private String promo;
	@JsonProperty("sortDesc")
	private String sortDesc;
	@JsonProperty("detail")
	private String detail;

	private double diemTrungBinhSao = 0.0;
	@JsonProperty("tongsao")
	private double tongSao = 0.0;
	@JsonProperty("soluongdanhgia")
	private Integer soLuongDanhGia = 0;

	private LocalDateTime deletedAt;

	// specs JSONB và 21 trường cấu hình phẳng
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

	public Integer getDungLuongPin() {
		if (dungLuongPin != null) return dungLuongPin;
		if (batteryMah != null) return batteryMah;
		if (specs != null && specs.containsKey("battery_mah")) {
			Object v = specs.get("battery_mah");
			if (v instanceof Number n) return n.intValue();
		}
		return null;
	}

	public String getManHinh() {
		if (manHinh != null) return manHinh;
		if (screenInch != null) return screenInch + " inch";
		if (specs != null && specs.containsKey("screen_inch")) {
			return specs.get("screen_inch") + " inch";
		}
		return null;
	}

	public String getHeDieuHanh() {
		if (heDieuHanh != null) return heDieuHanh;
		if (os != null) return os;
		if (specs != null && specs.containsKey("os")) {
			return String.valueOf(specs.get("os"));
		}
		return null;
	}

	public String getCameraSau() {
		if (cameraSau != null) return cameraSau;
		if (rearMainMp != null) return rearMainMp + " MP";
		if (specs != null && specs.containsKey("rear_main_mp")) {
			return specs.get("rear_main_mp") + " MP";
		}
		return null;
	}

	@Override
	@JsonProperty("masp")
	public Long getId() {
		return super.getId();
	}

	@JsonProperty("created")
	public String getCreated() {
		Date createdTimestamp = super.getCreatedDate();
		if (createdTimestamp == null)
			return null;

		// Format về chuỗi "yyyy-MM-dd"
		return new SimpleDateFormat("yyyy-MM-dd").format(createdTimestamp);
	}

	// Convert List<PromoDTO> thành JSON trước khi lưu
	public String convertPromoListToJson(List<PromoDTO> promoList) {
		ObjectMapper objectMapper = new ObjectMapper();
		try {
			return objectMapper.writeValueAsString(promoList);
		} catch (JacksonException e) {
			e.printStackTrace();
			return "[]"; // Trả về mảng rỗng nếu lỗi
		}
	}

	// Convert JSON từ database thành List<PromoDTO>
	@JsonProperty("promo")
	public List<PromoDTO> getPromoList() {
		if (this.promo == null || this.promo.isEmpty()) {
			return Collections.emptyList();
		}

		ObjectMapper objectMapper = new ObjectMapper();
		try {
			return objectMapper.readValue(this.promo, new TypeReference<List<PromoDTO>>() {
			});
		} catch (JacksonException e) {
			e.printStackTrace();
			return Collections.emptyList();
		}
	}

	public void setPromoList(List<PromoDTO> promoList) {
		this.promo = convertPromoListToJson(promoList);
	}

	// model xai cho add_sp,edit_sp
	private List<CategoryDTO> category_List;
	private List<MauSacDTO> color_List;
	private List<RamDTO> ram_List;
	private List<RomDTO> rom_List;
	private List<XuatXuDTO> xuatxu_List;
	private List<KhuVucKhoDTO> kho_List;

	private List<PhienBanSanPhamDTO> pbspList;

	// for show list product
	private Double giaXuat;
	private Double priceSale;

	// for config Android
	private Integer kichThuocRom;
	private Integer kichThuocRam;
	private String color;
	private Integer map;

	// for order in web
	private Integer maPX;
	private Boolean isCommentWithOrder;
}
