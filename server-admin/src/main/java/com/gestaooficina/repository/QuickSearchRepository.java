package com.gestaooficina.repository;

import com.gestaooficina.model.dto.QuickSearchResultDTO;

import java.util.List;

public interface QuickSearchRepository {

    List<QuickSearchResultDTO> search(String query);
}
