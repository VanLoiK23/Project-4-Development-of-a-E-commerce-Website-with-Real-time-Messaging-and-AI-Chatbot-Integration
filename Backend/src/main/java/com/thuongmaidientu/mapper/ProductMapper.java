package com.thuongmaidientu.mapper;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.thuongmaidientu.dto.ProductDTO;
import com.thuongmaidientu.dto.request.ProductRequest;
import com.thuongmaidientu.dto.response.ProductItemFeatureResponse;
import com.thuongmaidientu.dto.response.ProductResponse;
import com.thuongmaidientu.dto.response.ProductVariantResponse;
import com.thuongmaidientu.entity.ProductEntity;
import com.thuongmaidientu.entity.ProductItemFeatureEntity;
import com.thuongmaidientu.entity.ProductVariantEntity;

import com.thuongmaidientu.util.ResolutionTier;

@Mapper(componentModel = "spring")
public abstract class ProductMapper {

    @Mapping(target = "xuatXu", ignore = true)
    @Mapping(target = "thuongHieu", ignore = true)
    @Mapping(target = "khuVucKho", ignore = true)
    @Mapping(target = "listPhienBanSP", ignore = true)
    @Mapping(target = "listcomment", ignore = true)
    @Mapping(target = "xxID", ignore = true)
    @Mapping(target = "khoID", ignore = true)
    @Mapping(target = "thuonghieuID", ignore = true)
    public abstract ProductEntity toEntity(ProductRequest request);

    @Mapping(target = "xuatXuId", source = "xuatXu.maXuatXu")
    @Mapping(target = "tenXuatXu", source = "xuatXu.tenXuatXu")
    @Mapping(target = "thuongHieuId", source = "thuongHieu.maThuongHieu")
    @Mapping(target = "tenThuongHieu", source = "thuongHieu.tenThuongHieu")
    @Mapping(target = "khuVucKhoId", source = "khuVucKho.maKhuVuc")
    @Mapping(target = "tenKhuVucKho", source = "khuVucKho.tenKhuVuc")
    public abstract ProductResponse toResponse(ProductEntity entity);

    @Mapping(target = "xuatXuId", source = "xuatXu.maXuatXu")
    @Mapping(target = "xuatXu", source = "xuatXu.tenXuatXu")
    @Mapping(target = "thuongHieuId", source = "thuongHieu.maThuongHieu")
    @Mapping(target = "thuongHieu", source = "thuongHieu.tenThuongHieu")
    @Mapping(target = "khuVucKhoId", source = "khuVucKho.maKhuVuc")
    @Mapping(target = "khuVucKho", source = "khuVucKho.tenKhuVuc")
    public abstract ProductDTO toDTO(ProductEntity entity);

    @Mapping(target = "xuatXu", ignore = true)
    @Mapping(target = "thuongHieu", ignore = true)
    @Mapping(target = "khuVucKho", ignore = true)
    @Mapping(target = "listPhienBanSP", ignore = true)
    @Mapping(target = "listcomment", ignore = true)
    public abstract ProductEntity toEntity(ProductDTO dto);

    public ProductResponse toResponse(
            ProductEntity entity,
            List<ProductItemFeatureEntity> itemFeatures) {
        ProductResponse base = toResponse(entity);

        String[] images = entity.getHinhAnh().split(",");

        base.setImage(images.length > 0 ? images[0] : "");

        Map<String, Object> specs = entity.getSpecs() != null ? entity.getSpecs() : Collections.emptyMap();
        List<String> collections = entity.getCollections() != null ? entity.getCollections() : List.of();
        String categoryType = collections.isEmpty() ? null : collections.get(0);

        List<ProductVariantResponse> variantResponses = mapVariants(entity.getListPhienBanSP());
        ProductVariantResponse firstVariant = variantResponses.isEmpty() ? null : variantResponses.get(0);

        Integer price = firstVariant != null ? firstVariant.getPriceSale() : null;
        Integer originalPrice = firstVariant != null ? firstVariant.getGiaXuat() : null;
        Integer discountPercent = firstVariant != null ? firstVariant.getDiscountPercent() : 0;
        Integer stockQuantity = variantResponses.stream()
                .map(ProductVariantResponse::getSoLuongTon)
                .filter(q -> q != null)
                .reduce(0, Integer::sum);
        boolean inStock = stockQuantity > 0
                || (firstVariant != null && Boolean.TRUE.equals(firstVariant.getInStock()));

        String chipset = firstNonNullStr(base.getChipset(), specs.get("chipset"));
        Integer batteryMah = firstNonNullInt(base.getBatteryMah(), specs.get("battery_mah"));
        Double chargeW = firstNonNullDouble(base.getChargeW(), specs.get("charge_w"));
        Integer refreshHz = firstNonNullInt(base.getRefreshHz(), specs.get("refresh_hz"));
        Double screenInch = firstNonNullDouble(base.getScreenInch(), specs.get("screen_inch"));
        String ipRating = firstNonNullStr(base.getIpRating(), specs.get("ip_rating"));
        Boolean has5g = firstNonNullBool(base.getHas5g(), specs.get("has_5g"));
        Boolean nfc = firstNonNullBool(base.getNfc(), specs.get("nfc"));
        String os = firstNonNullStr(base.getOs(), specs.get("os"));

        List<String> keySpecs = buildKeySpecs(chipset, batteryMah, chargeW, refreshHz, screenInch);
        List<String> highlights = buildHighlights(ipRating, has5g, nfc, os, keySpecs);

        List<Map<String, Object>> aspects = buildAspectsFromSmoothTau06(itemFeatures);
        Map<String, Object> absaOverall = buildOverallScore(aspects);

        Integer resolutionW = firstNonNullInt(base.getResolutionW(), specs.get("resolution_w"));
        ResolutionTier tier = ResolutionTier.fromWidth(resolutionW);

        Map<String, Object> specsFilter = new LinkedHashMap<>();
        specsFilter.put("ramGb", specs.get("ram_gb"));
        specsFilter.put("storageGb", specs.get("storage_gb"));
        specsFilter.put("refreshHz", refreshHz);
        specsFilter.put("resolution", tier != null ? tier.label() : null);
        specsFilter.put("chargingTier", chargeW == null ? null
                : chargeW >= 60 ? "SUPER_FAST_60W" : chargeW >= 20 ? "FAST_20W" : "STANDARD");
        specsFilter.put("os", os);

        base.setCategoryType(categoryType);
        base.setPrice(price);
        base.setOriginalPrice(originalPrice);
        base.setDiscountPercent(discountPercent);
        base.setStockQuantity(stockQuantity);
        base.setInStock(inStock);
        base.setKeySpecs(keySpecs);
        base.setHighlights(highlights);
        base.setSpecsFilter(specsFilter);
        base.setAbsaOverall(absaOverall);
        base.setAspects(aspects);
        base.setCollections(collections);
        base.setVariants(variantResponses);
        base.setChipset(chipset);
        base.setBatteryMah(batteryMah);
        base.setChargeW(chargeW);
        base.setRefreshHz(refreshHz);
        base.setScreenInch(screenInch);
        base.setIpRating(ipRating);
        base.setHas5g(has5g);
        base.setNfc(nfc);
        base.setOs(os);
        return base;
    }

    protected List<ProductVariantResponse> mapVariants(List<ProductVariantEntity> rawList) {
        if (rawList == null || rawList.isEmpty()) {
            return List.of();
        }
        return rawList.stream()
                .sorted(Comparator.comparing(ProductVariantEntity::getMaPhienBanSP,
                        Comparator.nullsLast(Comparator.naturalOrder())))
                .map(v -> {
                    Integer giaXuat = v.getGiaXuat();
                    Integer priceSale = v.getPriceSale() != null ? v.getPriceSale() : giaXuat;
                    int discount = 0;
                    if (giaXuat != null && giaXuat > 0 && priceSale != null && priceSale < giaXuat) {
                        discount = (int) Math.round(((double) (giaXuat - priceSale) / giaXuat) * 100.0);
                    }
                    Integer ton = v.getSoLuongTon();
                    return ProductVariantResponse.builder()
                            .maPhienBanSP(v.getMaPhienBanSP())
                            .masp(v.getSanPham() != null ? v.getSanPham().getId() : null)
                            .romId(v.getRom() != null ? v.getRom().getMaDungLuongRom() : null)
                            .romLabel(v.getRom() != null ? formatStorageLabel(v.getRom().getKichThuocRom()) : null)
                            .ramId(v.getRam() != null ? v.getRam().getMaDungLuongRam() : null)
                            .ramLabel(v.getRam() != null ? v.getRam().getKichThuocRam().toString() : null)
                            .mausacId(v.getMauSac() != null ? v.getMauSac().getMaMauSac() : null)
                            .tenMauSac(v.getMauSac() != null ? v.getMauSac().getTenMauSac() : null)
                            .giaNhap(v.getGiaNhap())
                            .giaXuat(giaXuat)
                            .soLuongTon(ton)
                            .sale(v.getSale())
                            .priceSale(priceSale)
                            .discountPercent(discount)
                            .inStock(ton != null && ton > 0)
                            .build();
                })
                .toList();
    }

    protected String formatStorageLabel(Number sizeGb) {
        if (sizeGb == null) {
            return null;
        }
        double gb = sizeGb.doubleValue();
        if (gb <= 0) {
            return null;
        }
        if (gb >= 1024) {
            double tb = gb / 1024.0;
            return formatDecimal(tb) + " TB";
        }
        return formatDecimal(gb) + " GB";
    }

    private String formatDecimal(double val) {
        if (Math.abs(val - Math.round(val)) < 1e-9) {
            return String.valueOf(Math.round(val));
        }
        return String.format(java.util.Locale.US, "%.1f", val);
    }

    protected List<Map<String, Object>> buildAspectsFromSmoothTau06(List<ProductItemFeatureEntity> features) {
        if (features == null || features.isEmpty()) {
            return List.of();
        }
        return features.stream()
                .filter(f -> f.getId() != null
                        && f.getId().getConfig() != null
                        && f.getId().getConfig().toLowerCase(Locale.ROOT).startsWith("smooth_tau0.6_")
                        && f.getScore() != null)
                .map(f -> {
                    String aspectCode = f.getId().getAspect();
                    double score = Math.round(f.getScore() * 10.0) / 10.0;
                    Map<String, Object> item = new LinkedHashMap<>();
                    item.put("aspectKey", aspectCode);
                    item.put("displayName", mapAspectDisplayName(aspectCode));
                    item.put("score", score);
                    item.put("sentiment", deriveSentiment(score));
                    return item;
                })
                .toList();
    }

    protected Map<String, Object> buildOverallScore(List<Map<String, Object>> aspects) {
        if (aspects == null || aspects.isEmpty()) {
            return Map.of("score", 0.0, "sentiment", "NEUTRAL");
        }
        double avg = aspects.stream()
                .map(m -> ((Number) m.get("score")).doubleValue())
                .mapToDouble(Double::doubleValue)
                .average()
                .orElse(0.0);
        double rounded = Math.round(avg * 10.0) / 10.0;
        return Map.of(
                "score", rounded,
                "sentiment", deriveSentiment(rounded));
    }

    protected String deriveSentiment(double score) {
        if (score >= 4.0)
            return "POSITIVE";
        if (score >= 2.8)
            return "NEUTRAL";
        return "NEGATIVE";
    }

    protected String mapAspectDisplayName(String aspect) {
        if (aspect == null)
            return "";
        String upper = aspect.trim().toUpperCase(Locale.ROOT);
        if (upper.startsWith("AUDIO_")) {
            return "Tính năng";
        }
        return switch (upper) {
            case "SCREEN" -> "Màn hình";
            case "PERFORMANCE" -> "Hiệu suất";
            case "CAMERA" -> "Camera";
            case "BATTERY" -> "Pin";
            case "DESIGN" -> "Thiết kế";
            case "STORAGE" -> "Bộ nhớ";
            case "PRICE" -> "Giá bán";
            default -> aspect;
        };
    }

    protected List<String> buildKeySpecs(
            String chipset,
            Integer batteryMah,
            Double chargeW,
            Integer refreshHz,
            Double screenInch) {
        List<String> list = new ArrayList<>();
        if (chipset != null && !chipset.isBlank()) {
            list.add(chipset.trim());
        }

        StringBuilder pinSb = new StringBuilder();
        if (batteryMah != null && batteryMah > 0) {
            pinSb.append("Pin ").append(batteryMah).append("mAh");
        }
        if (chargeW != null && chargeW > 0) {
            if (pinSb.length() > 0)
                pinSb.append(" / ");
            pinSb.append("Sạc ").append(formatNum(chargeW)).append("W");
        }
        if (pinSb.length() > 0) {
            list.add(pinSb.toString());
        }

        StringBuilder screenSb = new StringBuilder();
        if (refreshHz != null && refreshHz > 0) {
            screenSb.append("Màn hình ").append(refreshHz).append("Hz");
        }
        if (screenInch != null && screenInch > 0) {
            if (screenSb.length() > 0)
                screenSb.append(" ");
            else
                screenSb.append("Màn hình ");
            screenSb.append(formatNum(screenInch)).append("\"");
        }
        if (screenSb.length() > 0) {
            list.add(screenSb.toString());
        }

        return list;
    }

    protected List<String> buildHighlights(
            String ipRating,
            Boolean has5g,
            Boolean nfc,
            String os,
            List<String> keySpecs) {
        List<String> list = new ArrayList<>();
        if (ipRating != null && !ipRating.isBlank()) {
            String h = "Kháng nước " + ipRating.trim();
            if (!keySpecs.contains(h))
                list.add(h);
        }
        if (Boolean.TRUE.equals(has5g)) {
            list.add("Hỗ trợ 5G");
        }
        if (Boolean.TRUE.equals(nfc)) {
            list.add("Hỗ trợ NFC");
        }
        if (os != null && !os.isBlank()) {
            String h = os.trim();
            if (!keySpecs.contains(h) && !list.contains(h))
                list.add(h);
        }
        return list;
    }

    protected String formatNum(double val) {
        return val == (long) val ? String.valueOf((long) val) : String.valueOf(val);
    }

    protected String firstNonNullStr(String a, Object b) {
        if (a != null && !a.isBlank())
            return a.trim();
        return b != null && !String.valueOf(b).isBlank() ? String.valueOf(b).trim() : null;
    }

    protected Integer firstNonNullInt(Integer a, Object b) {
        if (a != null)
            return a;
        if (b instanceof Number n)
            return n.intValue();
        if (b != null) {
            try {
                return Integer.parseInt(String.valueOf(b).trim());
            } catch (NumberFormatException ignored) {
            }
        }
        return null;
    }

    protected Double firstNonNullDouble(Double a, Object b) {
        if (a != null)
            return a;
        if (b instanceof Number n)
            return n.doubleValue();
        if (b != null) {
            try {
                return Double.parseDouble(String.valueOf(b).trim());
            } catch (NumberFormatException ignored) {
            }
        }
        return null;
    }

    protected Boolean firstNonNullBool(Boolean a, Object b) {
        if (a != null)
            return a;
        if (b instanceof Boolean bool)
            return bool;
        if (b != null) {
            String s = String.valueOf(b).trim().toLowerCase(Locale.ROOT);
            if ("true".equals(s) || "1".equals(s))
                return true;
            if ("false".equals(s) || "0".equals(s))
                return false;
        }
        return null;
    }

    @AfterMapping
    protected void collectSpecsFromRequest(ProductRequest request, @MappingTarget ProductEntity entity) {
        Map<String, Object> specs = entity.getSpecs() != null ? new HashMap<>(entity.getSpecs()) : new HashMap<>();
        if (request.getSpecs() != null)
            specs.putAll(request.getSpecs());
        putIfNotNull(specs, "os", request.getOs());
        putIfNotNull(specs, "release_year", request.getReleaseYear());
        putIfNotNull(specs, "chipset", request.getChipset());
        putIfNotNull(specs, "expandable_storage", request.getExpandableStorage());
        putIfNotNull(specs, "battery_mah", request.getBatteryMah());
        putIfNotNull(specs, "charge_w", request.getChargeW());
        putIfNotNull(specs, "screen_inch", request.getScreenInch());
        putIfNotNull(specs, "resolution_w", request.getResolutionW());
        putIfNotNull(specs, "resolution_h", request.getResolutionH());
        putIfNotNull(specs, "panel", request.getPanel());
        putIfNotNull(specs, "refresh_hz", request.getRefreshHz());
        putIfNotNull(specs, "brightness_nits_peak", request.getBrightnessNitsPeak());
        putIfNotNull(specs, "rear_main_mp", request.getRearMainMp());
        putIfNotNull(specs, "ois", request.getOis());
        putIfNotNull(specs, "weight_g", request.getWeightG());
        putIfNotNull(specs, "ip_rating", request.getIpRating());
        putIfNotNull(specs, "nfc", request.getNfc());
        putIfNotNull(specs, "has_5g", request.getHas5g());
        putIfNotNull(specs, "wifi_gen", request.getWifiGen());
        putIfNotNull(specs, "stereo_speaker", request.getStereoSpeaker());
        putIfNotNull(specs, "headphone_jack", request.getHeadphoneJack());
        entity.setSpecs(specs);
    }

    @AfterMapping
    protected void collectSpecsFromDTO(ProductDTO dto, @MappingTarget ProductEntity entity) {
        Map<String, Object> specs = entity.getSpecs() != null ? new HashMap<>(entity.getSpecs()) : new HashMap<>();
        if (dto.getSpecs() != null)
            specs.putAll(dto.getSpecs());
        putIfNotNull(specs, "os", dto.getOs());
        putIfNotNull(specs, "release_year", dto.getReleaseYear());
        putIfNotNull(specs, "chipset", dto.getChipset());
        putIfNotNull(specs, "expandable_storage", dto.getExpandableStorage());
        putIfNotNull(specs, "battery_mah", dto.getBatteryMah());
        putIfNotNull(specs, "charge_w", dto.getChargeW());
        putIfNotNull(specs, "screen_inch", dto.getScreenInch());
        putIfNotNull(specs, "resolution_w", dto.getResolutionW());
        putIfNotNull(specs, "resolution_h", dto.getResolutionH());
        putIfNotNull(specs, "panel", dto.getPanel());
        putIfNotNull(specs, "refresh_hz", dto.getRefreshHz());
        putIfNotNull(specs, "brightness_nits_peak", dto.getBrightnessNitsPeak());
        putIfNotNull(specs, "rear_main_mp", dto.getRearMainMp());
        putIfNotNull(specs, "ois", dto.getOis());
        putIfNotNull(specs, "weight_g", dto.getWeightG());
        putIfNotNull(specs, "ip_rating", dto.getIpRating());
        putIfNotNull(specs, "nfc", dto.getNfc());
        putIfNotNull(specs, "has_5g", dto.getHas5g());
        putIfNotNull(specs, "wifi_gen", dto.getWifiGen());
        putIfNotNull(specs, "stereo_speaker", dto.getStereoSpeaker());
        putIfNotNull(specs, "headphone_jack", dto.getHeadphoneJack());
        entity.setSpecs(specs);
    }

    @AfterMapping
    protected void extractSpecsToResponse(ProductEntity entity, @MappingTarget ProductResponse response) {
        Map<String, Object> specs = entity.getSpecs();
        if (specs != null) {
            response.setOs(firstNonNullStr(response.getOs(), specs.get("os")));
            response.setReleaseYear(firstNonNullInt(response.getReleaseYear(), specs.get("release_year")));
            response.setChipset(firstNonNullStr(response.getChipset(), specs.get("chipset")));
            response.setExpandableStorage(
                    firstNonNullBool(response.getExpandableStorage(), specs.get("expandable_storage")));
            response.setBatteryMah(firstNonNullInt(response.getBatteryMah(), specs.get("battery_mah")));
            response.setChargeW(firstNonNullDouble(response.getChargeW(), specs.get("charge_w")));
            response.setScreenInch(firstNonNullDouble(response.getScreenInch(), specs.get("screen_inch")));
            response.setResolutionW(firstNonNullInt(response.getResolutionW(), specs.get("resolution_w")));
            response.setResolutionH(firstNonNullInt(response.getResolutionH(), specs.get("resolution_h")));
            response.setPanel(firstNonNullStr(response.getPanel(), specs.get("panel")));
            response.setRefreshHz(firstNonNullInt(response.getRefreshHz(), specs.get("refresh_hz")));
            response.setBrightnessNitsPeak(
                    firstNonNullInt(response.getBrightnessNitsPeak(), specs.get("brightness_nits_peak")));
            response.setRearMainMp(firstNonNullDouble(response.getRearMainMp(), specs.get("rear_main_mp")));
            response.setOis(firstNonNullBool(response.getOis(), specs.get("ois")));
            response.setWeightG(firstNonNullDouble(response.getWeightG(), specs.get("weight_g")));
            response.setIpRating(firstNonNullStr(response.getIpRating(), specs.get("ip_rating")));
            response.setNfc(firstNonNullBool(response.getNfc(), specs.get("nfc")));
            response.setHas5g(firstNonNullBool(response.getHas5g(), specs.get("has_5g")));
            response.setWifiGen(firstNonNullStr(response.getWifiGen(), specs.get("wifi_gen")));
            response.setStereoSpeaker(firstNonNullBool(response.getStereoSpeaker(), specs.get("stereo_speaker")));
            response.setHeadphoneJack(firstNonNullBool(response.getHeadphoneJack(), specs.get("headphone_jack")));
        }
        if (entity.getSoLuongDanhGia() != null && entity.getSoLuongDanhGia() > 0 && entity.getTongSao() != null) {
            response.setDiemTrungBinhSao(entity.getTongSao() / entity.getSoLuongDanhGia());
        }
    }

    @AfterMapping
    protected void extractSpecsToDTO(ProductEntity entity, @MappingTarget ProductDTO dto) {
        Map<String, Object> specs = entity.getSpecs();
        if (specs != null) {
            dto.setOs(firstNonNullStr(dto.getOs(), specs.get("os")));
            dto.setReleaseYear(firstNonNullInt(dto.getReleaseYear(), specs.get("release_year")));
            dto.setChipset(firstNonNullStr(dto.getChipset(), specs.get("chipset")));
            dto.setExpandableStorage(firstNonNullBool(dto.getExpandableStorage(), specs.get("expandable_storage")));
            dto.setBatteryMah(firstNonNullInt(dto.getBatteryMah(), specs.get("battery_mah")));
            dto.setChargeW(firstNonNullDouble(dto.getChargeW(), specs.get("charge_w")));
            dto.setScreenInch(firstNonNullDouble(dto.getScreenInch(), specs.get("screen_inch")));
            dto.setResolutionW(firstNonNullInt(dto.getResolutionW(), specs.get("resolution_w")));
            dto.setResolutionH(firstNonNullInt(dto.getResolutionH(), specs.get("resolution_h")));
            dto.setPanel(firstNonNullStr(dto.getPanel(), specs.get("panel")));
            dto.setRefreshHz(firstNonNullInt(dto.getRefreshHz(), specs.get("refresh_hz")));
            dto.setBrightnessNitsPeak(firstNonNullInt(dto.getBrightnessNitsPeak(), specs.get("brightness_nits_peak")));
            dto.setRearMainMp(firstNonNullDouble(dto.getRearMainMp(), specs.get("rear_main_mp")));
            dto.setOis(firstNonNullBool(dto.getOis(), specs.get("ois")));
            dto.setWeightG(firstNonNullDouble(dto.getWeightG(), specs.get("weight_g")));
            dto.setIpRating(firstNonNullStr(dto.getIpRating(), specs.get("ip_rating")));
            dto.setNfc(firstNonNullBool(dto.getNfc(), specs.get("nfc")));
            dto.setHas5g(firstNonNullBool(dto.getHas5g(), specs.get("has_5g")));
            dto.setWifiGen(firstNonNullStr(dto.getWifiGen(), specs.get("wifi_gen")));
            dto.setStereoSpeaker(firstNonNullBool(dto.getStereoSpeaker(), specs.get("stereo_speaker")));
            dto.setHeadphoneJack(firstNonNullBool(dto.getHeadphoneJack(), specs.get("headphone_jack")));
        }
        if (entity.getSoLuongDanhGia() != null && entity.getSoLuongDanhGia() > 0 && entity.getTongSao() != null) {
            dto.setDiemTrungBinhSao(entity.getTongSao() / entity.getSoLuongDanhGia());
        }
    }

    private void putIfNotNull(Map<String, Object> target, String key, Object val) {
        if (val != null) {
            target.put(key, val);
        }
    }
}