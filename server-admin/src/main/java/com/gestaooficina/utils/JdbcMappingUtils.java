package com.gestaooficina.utils;

import java.sql.Timestamp;
import java.time.Instant;

public final class JdbcMappingUtils {

    private JdbcMappingUtils() {
    }

    public static Instant toInstant(Timestamp timestamp) {
        return timestamp != null ? timestamp.toInstant() : null;
    }

    public static int clampPageSize(Integer pageSize) {
        int size = pageSize == null ? 20 : pageSize;
        if (size < 1) {
            return 1;
        }
        return Math.min(size, 100);
    }

    public static int safePage(Integer page) {
        return page == null ? 0 : Math.max(page, 0);
    }
}
