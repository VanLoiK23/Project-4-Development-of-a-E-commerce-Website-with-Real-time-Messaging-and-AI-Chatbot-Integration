package com.thuongmaidientu.util;

public enum ResolutionTier {
    HD_PLUS("HD+", 0, 1080),
    FULL_HD_PLUS("Full HD+", 1080, 1200),
    QHD_1_5K("1.5K", 1200, 1344),
    QHD_2K_PLUS("2K+", 1344, Integer.MAX_VALUE);

    private final String label;
    private final int minWidth;   // inclusive
    private final int maxWidth;   // exclusive

    ResolutionTier(String label, int minWidth, int maxWidth) {
        this.label = label;
        this.minWidth = minWidth;
        this.maxWidth = maxWidth;
    }

    public String label() { return label; }
    public int minWidth() { return minWidth; }
    public int maxWidth() { return maxWidth; }
    public boolean hasUpperBound() { return maxWidth != Integer.MAX_VALUE; }

    public static ResolutionTier fromCode(String code) {
        if (code == null) return null;
        try {
            return valueOf(code.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    public static ResolutionTier fromWidth(Integer width) {
        if (width == null || width <= 0) return null;
        for (ResolutionTier t : values()) {
            if (width >= t.minWidth && width < t.maxWidth) return t;
        }
        return null;
    }
}