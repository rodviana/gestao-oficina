package com.gestaooficina.repository;

import com.gestaooficina.model.dto.QuickSearchResultDTO;

import java.util.List;

public interface QuickSearchRepository {

    long count(String query);

    List<QuickSearchResultDTO> search(String query, int page, int pageSize);
}
