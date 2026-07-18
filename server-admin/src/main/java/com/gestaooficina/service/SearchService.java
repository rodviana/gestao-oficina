package com.gestaooficina.service;

import com.gestaooficina.exception.GestaoOficinaGenericException;
import com.gestaooficina.model.dto.QuickSearchResultDTO;
import com.gestaooficina.repository.QuickSearchRepository;
import com.gestaooficina.utils.UserValidationUtils;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SearchService {

    private final QuickSearchRepository quickSearchRepository;

    public SearchService(QuickSearchRepository quickSearchRepository) {
        this.quickSearchRepository = quickSearchRepository;
    }

    public List<QuickSearchResultDTO> quickSearch(String query) {
        UserValidationUtils.requireNonBlank(query, "Termo de busca é obrigatório.");
        return quickSearchRepository.search(query.trim());
    }
}
