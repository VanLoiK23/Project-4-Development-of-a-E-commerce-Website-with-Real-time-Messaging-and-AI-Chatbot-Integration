package com.thuongmaidientu.mapper;

import java.util.HashMap;
import java.util.Map;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.thuongmaidientu.dto.ProductDTO;
import com.thuongmaidientu.dto.request.ProductRequest;
import com.thuongmaidientu.dto.response.ProductResponse;
import com.thuongmaidientu.entity.ProductEntity;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(target = "xuatXu", ignore = true)
    @Mapping(target = "thuongHieu", ignore = true)
    @Mapping(target = "khuVucKho", ignore = true)
    @Mapping(target = "listPhienBanSP", ignore = true)
    @Mapping(target = "listcomment", ignore = true)
    @Mapping(target = "xxID", ignore = true)
    @Mapping(target = "khoID", ignore = true)
    @Mapping(target = "thuonghieuID", ignore = true)
    ProductEntity toEntity(ProductRequest request);

    @Mapping(target = "xuatXuId", source = "xuatXu.maXuatXu")
    @Mapping(target = "tenXuatXu", source = "xuatXu.tenXuatXu")
    @Mapping(target = "thuongHieuId", source = "thuongHieu.maThuongHieu")
    @Mapping(target = "tenThuongHieu", source = "thuongHieu.tenThuongHieu")
    @Mapping(target = "khuVucKhoId", source = "khuVucKho.maKhuVuc")
    @Mapping(target = "tenKhuVucKho", source = "khuVucKho.tenKhuVuc")
    ProductResponse toResponse(ProductEntity entity);

    @Mapping(target = "xuatXuId", source = "xuatXu.maXuatXu")
    @Mapping(target = "xuatXu", source = "xuatXu.tenXuatXu")
    @Mapping(target = "thuongHieuId", source = "thuongHieu.maThuongHieu")
    @Mapping(target = "thuongHieu", source = "thuongHieu.tenThuongHieu")
    @Mapping(target = "khuVucKhoId", source = "khuVucKho.maKhuVuc")
    @Mapping(target = "khuVucKho", source = "khuVucKho.tenKhuVuc")
    ProductDTO toDTO(ProductEntity entity);

    @Mapping(target = "xuatXu", ignore = true)
    @Mapping(target = "thuongHieu", ignore = true)
    @Mapping(target = "khuVucKho", ignore = true)
    @Mapping(target = "listPhienBanSP", ignore = true)
    @Mapping(target = "listcomment", ignore = true)
    ProductEntity toEntity(ProductDTO dto);

    @AfterMapping
    default void collectSpecsFromRequest(ProductRequest request, @MappingTarget ProductEntity entity) {
        Map<String, Object> specs = entity.getSpecs() != null ? new HashMap<>(entity.getSpecs()) : new HashMap<>();
        if (request.getSpecs() != null) specs.putAll(request.getSpecs());
        if (request.getOs() != null) specs.put("os", request.getOs());
        if (request.getReleaseYear() != null) specs.put("release_year", request.getReleaseYear());
        if (request.getChipset() != null) specs.put("chipset", request.getChipset());
        if (request.getExpandableStorage() != null) specs.put("expandable_storage", request.getExpandableStorage());
        if (request.getBatteryMah() != null) specs.put("battery_mah", request.getBatteryMah());
        if (request.getChargeW() != null) specs.put("charge_w", request.getChargeW());
        if (request.getScreenInch() != null) specs.put("screen_inch", request.getScreenInch());
        if (request.getResolutionW() != null) specs.put("resolution_w", request.getResolutionW());
        if (request.getResolutionH() != null) specs.put("resolution_h", request.getResolutionH());
        if (request.getPanel() != null) specs.put("panel", request.getPanel());
        if (request.getRefreshHz() != null) specs.put("refresh_hz", request.getRefreshHz());
        if (request.getBrightnessNitsPeak() != null) specs.put("brightness_nits_peak", request.getBrightnessNitsPeak());
        if (request.getRearMainMp() != null) specs.put("rear_main_mp", request.getRearMainMp());
        if (request.getOis() != null) specs.put("ois", request.getOis());
        if (request.getWeightG() != null) specs.put("weight_g", request.getWeightG());
        if (request.getIpRating() != null) specs.put("ip_rating", request.getIpRating());
        if (request.getNfc() != null) specs.put("nfc", request.getNfc());
        if (request.getHas5g() != null) specs.put("has_5g", request.getHas5g());
        if (request.getWifiGen() != null) specs.put("wifi_gen", request.getWifiGen());
        if (request.getStereoSpeaker() != null) specs.put("stereo_speaker", request.getStereoSpeaker());
        if (request.getHeadphoneJack() != null) specs.put("headphone_jack", request.getHeadphoneJack());
        entity.setSpecs(specs);
    }

    @AfterMapping
    default void collectSpecsFromDTO(ProductDTO dto, @MappingTarget ProductEntity entity) {
        Map<String, Object> specs = entity.getSpecs() != null ? new HashMap<>(entity.getSpecs()) : new HashMap<>();
        if (dto.getSpecs() != null) specs.putAll(dto.getSpecs());
        if (dto.getOs() != null) specs.put("os", dto.getOs());
        if (dto.getReleaseYear() != null) specs.put("release_year", dto.getReleaseYear());
        if (dto.getChipset() != null) specs.put("chipset", dto.getChipset());
        if (dto.getExpandableStorage() != null) specs.put("expandable_storage", dto.getExpandableStorage());
        if (dto.getBatteryMah() != null) specs.put("battery_mah", dto.getBatteryMah());
        if (dto.getChargeW() != null) specs.put("charge_w", dto.getChargeW());
        if (dto.getScreenInch() != null) specs.put("screen_inch", dto.getScreenInch());
        if (dto.getResolutionW() != null) specs.put("resolution_w", dto.getResolutionW());
        if (dto.getResolutionH() != null) specs.put("resolution_h", dto.getResolutionH());
        if (dto.getPanel() != null) specs.put("panel", dto.getPanel());
        if (dto.getRefreshHz() != null) specs.put("refresh_hz", dto.getRefreshHz());
        if (dto.getBrightnessNitsPeak() != null) specs.put("brightness_nits_peak", dto.getBrightnessNitsPeak());
        if (dto.getRearMainMp() != null) specs.put("rear_main_mp", dto.getRearMainMp());
        if (dto.getOis() != null) specs.put("ois", dto.getOis());
        if (dto.getWeightG() != null) specs.put("weight_g", dto.getWeightG());
        if (dto.getIpRating() != null) specs.put("ip_rating", dto.getIpRating());
        if (dto.getNfc() != null) specs.put("nfc", dto.getNfc());
        if (dto.getHas5g() != null) specs.put("has_5g", dto.getHas5g());
        if (dto.getWifiGen() != null) specs.put("wifi_gen", dto.getWifiGen());
        if (dto.getStereoSpeaker() != null) specs.put("stereo_speaker", dto.getStereoSpeaker());
        if (dto.getHeadphoneJack() != null) specs.put("headphone_jack", dto.getHeadphoneJack());
        entity.setSpecs(specs);
    }

    @AfterMapping
    default void extractSpecsToResponse(ProductEntity entity, @MappingTarget ProductResponse response) {
        Map<String, Object> specs = entity.getSpecs();
        if (specs != null) {
            if (specs.get("os") != null) response.setOs(specs.get("os").toString());
            if (specs.get("release_year") != null) response.setReleaseYear(((Number) specs.get("release_year")).intValue());
            if (specs.get("chipset") != null) response.setChipset(specs.get("chipset").toString());
            if (specs.get("expandable_storage") != null) response.setExpandableStorage((Boolean) specs.get("expandable_storage"));
            if (specs.get("battery_mah") != null) response.setBatteryMah(((Number) specs.get("battery_mah")).intValue());
            if (specs.get("charge_w") != null) response.setChargeW(((Number) specs.get("charge_w")).doubleValue());
            if (specs.get("screen_inch") != null) response.setScreenInch(((Number) specs.get("screen_inch")).doubleValue());
            if (specs.get("resolution_w") != null) response.setResolutionW(((Number) specs.get("resolution_w")).intValue());
            if (specs.get("resolution_h") != null) response.setResolutionH(((Number) specs.get("resolution_h")).intValue());
            if (specs.get("panel") != null) response.setPanel(specs.get("panel").toString());
            if (specs.get("refresh_hz") != null) response.setRefreshHz(((Number) specs.get("refresh_hz")).intValue());
            if (specs.get("brightness_nits_peak") != null) response.setBrightnessNitsPeak(((Number) specs.get("brightness_nits_peak")).intValue());
            if (specs.get("rear_main_mp") != null) response.setRearMainMp(((Number) specs.get("rear_main_mp")).doubleValue());
            if (specs.get("ois") != null) response.setOis((Boolean) specs.get("ois"));
            if (specs.get("weight_g") != null) response.setWeightG(((Number) specs.get("weight_g")).doubleValue());
            if (specs.get("ip_rating") != null) response.setIpRating(specs.get("ip_rating").toString());
            if (specs.get("nfc") != null) response.setNfc((Boolean) specs.get("nfc"));
            if (specs.get("has_5g") != null) response.setHas5g((Boolean) specs.get("has_5g"));
            if (specs.get("wifi_gen") != null) response.setWifiGen(specs.get("wifi_gen").toString());
            if (specs.get("stereo_speaker") != null) response.setStereoSpeaker((Boolean) specs.get("stereo_speaker"));
            if (specs.get("headphone_jack") != null) response.setHeadphoneJack((Boolean) specs.get("headphone_jack"));
        }
        if (entity.getSoLuongDanhGia() != null && entity.getSoLuongDanhGia() > 0 && entity.getTongSao() != null) {
            response.setDiemTrungBinhSao(entity.getTongSao() / entity.getSoLuongDanhGia());
        }
    }

    @AfterMapping
    default void extractSpecsToDTO(ProductEntity entity, @MappingTarget ProductDTO dto) {
        Map<String, Object> specs = entity.getSpecs();
        if (specs != null) {
            if (specs.get("os") != null) dto.setOs(specs.get("os").toString());
            if (specs.get("release_year") != null) dto.setReleaseYear(((Number) specs.get("release_year")).intValue());
            if (specs.get("chipset") != null) dto.setChipset(specs.get("chipset").toString());
            if (specs.get("expandable_storage") != null) dto.setExpandableStorage((Boolean) specs.get("expandable_storage"));
            if (specs.get("battery_mah") != null) dto.setBatteryMah(((Number) specs.get("battery_mah")).intValue());
            if (specs.get("charge_w") != null) dto.setChargeW(((Number) specs.get("charge_w")).doubleValue());
            if (specs.get("screen_inch") != null) dto.setScreenInch(((Number) specs.get("screen_inch")).doubleValue());
            if (specs.get("resolution_w") != null) dto.setResolutionW(((Number) specs.get("resolution_w")).intValue());
            if (specs.get("resolution_h") != null) dto.setResolutionH(((Number) specs.get("resolution_h")).intValue());
            if (specs.get("panel") != null) dto.setPanel(specs.get("panel").toString());
            if (specs.get("refresh_hz") != null) dto.setRefreshHz(((Number) specs.get("refresh_hz")).intValue());
            if (specs.get("brightness_nits_peak") != null) dto.setBrightnessNitsPeak(((Number) specs.get("brightness_nits_peak")).intValue());
            if (specs.get("rear_main_mp") != null) dto.setRearMainMp(((Number) specs.get("rear_main_mp")).doubleValue());
            if (specs.get("ois") != null) dto.setOis((Boolean) specs.get("ois"));
            if (specs.get("weight_g") != null) dto.setWeightG(((Number) specs.get("weight_g")).doubleValue());
            if (specs.get("ip_rating") != null) dto.setIpRating(specs.get("ip_rating").toString());
            if (specs.get("nfc") != null) dto.setNfc((Boolean) specs.get("nfc"));
            if (specs.get("has_5g") != null) dto.setHas5g((Boolean) specs.get("has_5g"));
            if (specs.get("wifi_gen") != null) dto.setWifiGen(specs.get("wifi_gen").toString());
            if (specs.get("stereo_speaker") != null) dto.setStereoSpeaker((Boolean) specs.get("stereo_speaker"));
            if (specs.get("headphone_jack") != null) dto.setHeadphoneJack((Boolean) specs.get("headphone_jack"));
        }
        if (entity.getSoLuongDanhGia() != null && entity.getSoLuongDanhGia() > 0 && entity.getTongSao() != null) {
            dto.setDiemTrungBinhSao(entity.getTongSao() / entity.getSoLuongDanhGia());
        }
    }
}
