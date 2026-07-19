package com.gestaooficina.utils;

import com.gestaooficina.model.dto.PageResultDTO;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;

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

    public static int pageMaxNumber(long total, int pageSize) {
        return total <= 0 ? 0 : (int) ((total - 1) / pageSize);
    }

    public static int resolvePage(int page, int pageMax) {
        return Math.min(Math.max(page, 0), pageMax);
    }

    public static <T> PageResultDTO<T> toPageResult(List<T> items, long total, int page, int pageSize) {
        int pageMax = pageMaxNumber(total, pageSize);
        int resolved = resolvePage(page, pageMax);
        return new PageResultDTO<>(items, total, resolved, pageSize, pageMax);
    }
}
