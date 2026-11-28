package com.thuongmaidientu.service.spec;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Objects;

import org.springframework.data.jpa.domain.Specification;

import com.thuongmaidientu.dto.request.ProductFilterRequest;
import com.thuongmaidientu.entity.CategoryEntity;
import com.thuongmaidientu.entity.ProductEntity;
import com.thuongmaidientu.entity.ProductVariantEntity;
import com.thuongmaidientu.entity.RamEntity;
import com.thuongmaidientu.entity.RomEntity;
import com.thuongmaidientu.util.ResolutionTier;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;

public final class ProductSpecifications {

    public static final String SORT_PRICE_ASC = "price_asc";
    public static final String SORT_PRICE_DESC = "price_desc";

    public static final String CHARGING_FAST = "FAST_20W";
    public static final String CHARGING_SUPER_FAST = "SUPER_FAST_60W";

    public static final String TAG_BATTERY_7000 = "BATTERY_7000";
    public static final String TAG_CAMERA_200MP = "CAMERA_200MP";
    public static final String TAG_IP68 = "IP68";

    private ProductSpecifications() {
    }

    public static Specification<ProductEntity> byFilter(ProductFilterRequest f) {
        return (root, rawQuery, cb) -> {
            CriteriaQuery<?> query = Objects.requireNonNull(rawQuery, "CriteriaQuery is required");
            boolean isCountQuery = Long.class.equals(query.getResultType());
            List<Predicate> ps = new ArrayList<>();

            if (!isCountQuery) {
                root.fetch("thuongHieu", JoinType.LEFT);
                root.fetch("xuatXu", JoinType.LEFT);
                root.fetch("khuVucKho", JoinType.LEFT);
            }

            ps.add(cb.equal(root.get("trash"), "active"));
            ps.add(cb.equal(root.get("status"), 1));

            if (f.getKeyword() != null && !f.getKeyword().isBlank()) {
                String kw = "%" + escapeLike(f.getKeyword().trim().toLowerCase(Locale.ROOT)) + "%";
                ps.add(cb.like(cb.lower(root.get("tenSanPham")), kw, '\\'));
            }

            if (has(f.getBrands())) {
                Join<ProductEntity, CategoryEntity> brand = root.join("thuongHieu", JoinType.INNER);
                ps.add(cb.lower(brand.<String>get("tenThuongHieu")).in(lower(f.getBrands())));
            }

            if (has(f.getOs())) {
                ps.add(cb.lower(specText(root, cb, "os")).in(lower(f.getOs())));
            }

            if (f.getCollection() != null && !f.getCollection().isBlank()) {
                ps.add(cb.isTrue(
                        cb.function(
                                "jsonb_path_exists",
                                Boolean.class,
                                root.get("collections"),
                                cb.literal("$[*] ? (@ == \"" + f.getCollection().replace("\"", "") + "\")"))));
            }

            if (has(f.getRefreshRates())) {
                List<Double> hz = f.getRefreshRates().stream().map(Integer::doubleValue).toList();
                ps.add(specNum(root, cb, "refresh_hz").in(hz));
            }

            if (has(f.getResolutions())) {
                Expression<Double> w = specNum(root, cb, "resolution_w");
                List<Predicate> any = new ArrayList<>();
                for (String code : f.getResolutions()) {
                    ResolutionTier tier = ResolutionTier.fromCode(code);
                    if (tier == null) {
                        continue;
                    }
                    Predicate p = cb.greaterThanOrEqualTo(w, (double) tier.minWidth());
                    if (tier.hasUpperBound()) {
                        p = cb.and(p, cb.lessThan(w, (double) tier.maxWidth()));
                    }
                    any.add(p);
                }
                if (!any.isEmpty()) {
                    ps.add(cb.or(any.toArray(new Predicate[0])));
                }
            }

            if (has(f.getCharging())) {
                Expression<Double> chargeW = specNum(root, cb, "charge_w");
                List<Predicate> any = new ArrayList<>();
                for (String c : f.getCharging()) {
                    if (CHARGING_FAST.equalsIgnoreCase(c)) {
                        any.add(cb.greaterThanOrEqualTo(chargeW, 20.0));
                    } else if (CHARGING_SUPER_FAST.equalsIgnoreCase(c)) {
                        any.add(cb.greaterThanOrEqualTo(chargeW, 60.0));
                    }
                }
                if (!any.isEmpty()) {
                    ps.add(cb.or(any.toArray(new Predicate[0])));
                }
            }

            if (has(f.getQuickTags())) {
                for (String tag : f.getQuickTags()) {
                    if (TAG_BATTERY_7000.equalsIgnoreCase(tag)) {
                        ps.add(cb.greaterThanOrEqualTo(specNum(root, cb, "battery_mah"), 7000.0));
                    } else if (TAG_CAMERA_200MP.equalsIgnoreCase(tag)) {
                        ps.add(cb.greaterThanOrEqualTo(specNum(root, cb, "rear_main_mp"), 200.0));
                    } else if (TAG_IP68.equalsIgnoreCase(tag)) {
                        Expression<String> ip = cb.lower(specText(root, cb, "ip_rating"));
                        ps.add(cb.or(cb.like(ip, "ip68%"), cb.like(ip, "ip69%")));
                    }
                }
            }

            if (has(f.getPanels())) {
                ps.add(cb.lower(specText(root, cb, "panel")).in(lower(f.getPanels())));
            }
            addBool(ps, cb, root, "has_5g", f.getHas5g());
            addBool(ps, cb, root, "nfc", f.getNfc());
            addBool(ps, cb, root, "ois", f.getOis());
            addBool(ps, cb, root, "expandable_storage", f.getExpandableStorage());
            addBool(ps, cb, root, "headphone_jack", f.getHeadphoneJack());
            addBool(ps, cb, root, "stereo_speaker", f.getStereoSpeaker());

            Subquery<Integer> variantSq = query.subquery(Integer.class);
            Root<ProductVariantEntity> v = variantSq.from(ProductVariantEntity.class);
            List<Predicate> vp = new ArrayList<>();
            vp.add(cb.equal(v.get("sanPham").get("id"), root.get("id")));
            if (f.getPriceMin() != null) {
                vp.add(cb.greaterThanOrEqualTo(v.<Integer>get("priceSale"), f.getPriceMin()));
            }
            if (f.getPriceMax() != null) {
                vp.add(cb.lessThanOrEqualTo(v.<Integer>get("priceSale"), f.getPriceMax()));
            }
            if (has(f.getRamGb())) {
                Join<ProductVariantEntity, RamEntity> ram = v.join("ram", JoinType.INNER);
                vp.add(ram.<Integer>get("kichThuocRam").in(f.getRamGb()));
            }
            if (has(f.getStorageGb())) {
                Join<ProductVariantEntity, RomEntity> rom = v.join("rom", JoinType.INNER);
                vp.add(rom.<Integer>get("kichThuocRom").in(f.getStorageGb()));
            }
            variantSq.select(cb.literal(1)).where(vp.toArray(new Predicate[0]));
            ps.add(cb.exists(variantSq));

            String sort = f.getSort();
            boolean priceAsc = SORT_PRICE_ASC.equalsIgnoreCase(sort);
            boolean priceDesc = SORT_PRICE_DESC.equalsIgnoreCase(sort);
            if (!isCountQuery && (priceAsc || priceDesc)) {
                Subquery<Integer> minPrice = query.subquery(Integer.class);
                Root<ProductVariantEntity> pv = minPrice.from(ProductVariantEntity.class);
                minPrice.select(cb.min(pv.<Integer>get("priceSale")))
                        .where(cb.equal(pv.get("sanPham").get("id"), root.get("id")));
                query.orderBy(priceAsc ? cb.asc(minPrice) : cb.desc(minPrice), cb.asc(root.get("id")));
            }

            return cb.and(ps.toArray(new Predicate[0]));
        };
    }

    // ======================= helpers =======================
    private static Expression<String> specText(Root<ProductEntity> root, CriteriaBuilder cb, String key) {
        return cb.function("jsonb_extract_path_text", String.class, root.get("specs"), cb.literal(key));
    }

    private static Expression<Double> specNum(Root<ProductEntity> root, CriteriaBuilder cb, String key) {
        return cb.nullif(specText(root, cb, key), "").as(Double.class);
    }

    private static void addBool(List<Predicate> ps, CriteriaBuilder cb, Root<ProductEntity> root, String key,
            Boolean value) {
        if (value == null) {
            return;
        }
        ps.add(cb.equal(specText(root, cb, key), value ? "true" : "false"));
    }

    private static boolean has(List<?> list) {
        return list != null && !list.isEmpty();
    }

    private static List<String> lower(List<String> values) {
        return values.stream().filter(Objects::nonNull).map(s -> s.trim().toLowerCase(Locale.ROOT)).toList();
    }

    private static String escapeLike(String s) {
        return s.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_");
    }
}