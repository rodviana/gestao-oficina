package com.gestaooficina.utils;

import com.gestaooficina.exception.GestaoOficinaGenericException;
import com.gestaooficina.model.dto.PageResultDTO;

import java.util.List;

public final class PageUtils {

    private PageUtils() {
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

    public static void validate(int page, int pageSize) {
        if (page < 0) {
            throw new GestaoOficinaGenericException("Número de página inválido.");
        }
        if (pageSize <= 0) {
            throw new GestaoOficinaGenericException("Tamanho da página deve ser maior que zero.");
        }
        if (pageSize > 100) {
            throw new GestaoOficinaGenericException("Tamanho máximo da página é 100.");
        }
    }

    public static int pageMaxNumber(long total, int pageSize) {
        return total <= 0 ? 0 : (int) ((total - 1) / pageSize);
    }

    public static <T> PageResultDTO<T> toPage(List<T> items, long total, int page, int pageSize) {
        int pageMax = pageMaxNumber(total, pageSize);
        int resolved = Math.min(Math.max(page, 0), pageMax);
        return new PageResultDTO<>(items, total, resolved, pageSize, pageMax);
    }
}
