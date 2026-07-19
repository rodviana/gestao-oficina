package com.gestaooficina.service;

import com.gestaooficina.model.dto.PageResultDTO;
import com.gestaooficina.model.dto.QuickSearchResultDTO;
import com.gestaooficina.repository.QuickSearchRepository;
import com.gestaooficina.utils.JdbcMappingUtils;
import com.gestaooficina.utils.UserValidationUtils;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SearchService {

    private final QuickSearchRepository quickSearchRepository;

    public SearchService(QuickSearchRepository quickSearchRepository) {
        this.quickSearchRepository = quickSearchRepository;
    }

    public PageResultDTO<QuickSearchResultDTO> quickSearch(String query, Integer page, Integer pageSize) {
        UserValidationUtils.requireNonBlank(query, "Termo de busca é obrigatório.");
        int safePageSize = JdbcMappingUtils.clampPageSize(pageSize);
        int safePage = JdbcMappingUtils.safePage(page);
        UserValidationUtils.validatePagination(safePage, safePageSize);

        String q = query.trim();
        long total = quickSearchRepository.count(q);
        int pageMax = JdbcMappingUtils.pageMaxNumber(total, safePageSize);
        int resolvedPage = JdbcMappingUtils.resolvePage(safePage, pageMax);
        List<QuickSearchResultDTO> items = quickSearchRepository.search(q, resolvedPage, safePageSize);
        return new PageResultDTO<>(items, total, resolvedPage, safePageSize, pageMax);
    }
}
