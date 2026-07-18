package com.gestaooficina.repository.impl;

import com.gestaooficina.exception.GlobalException;
import com.gestaooficina.model.enums.ValidationMessageEnum;
import com.gestaooficina.model.response.UserListItemResponse;
import com.gestaooficina.repository.AdminUserListJdbcRepository;
import com.gestaooficina.repository.filter.UserListFilter;
import com.gestaooficina.repository.mapper.UserListRowMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class AdminUserListJdbcRepositoryImpl implements AdminUserListJdbcRepository {

    private static final Logger log = LoggerFactory.getLogger(AdminUserListJdbcRepositoryImpl.class);

    private final NamedParameterJdbcTemplate jdbc;

    public AdminUserListJdbcRepositoryImpl(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public long countUsers(UserListFilter filter) {
        try {
            Long total = jdbc.queryForObject(
                    SQL_COUNT_USERS,
                    queryParams(filter),
                    Long.class);
            return total != null ? total : 0L;
        } catch (DataAccessException e) {
            log.error("[user-list] count JDBC error: {}", e.getMessage(), e);
            throw GlobalException.of(ValidationMessageEnum.FAILED_LOAD_USERS);
        }
    }

    @Override
    public List<UserListItemResponse> findUsersPage(UserListFilter filter) {
        int page = Math.max(filter.getPageOrDefault(), 0);
        int pageSize = clampPageSize(filter.getPageSizeOrDefault());
        MapSqlParameterSource params = queryParams(filter)
                .addValue("page", page)
                .addValue("pageSize", pageSize);

        try {
            log.info("[user-list] exec p_find_users_filtered page={} pageSize={}", page, pageSize);
            return jdbc.query(SQL_FIND_USERS, params, UserListRowMapper.LIST_ITEM);
        } catch (DataAccessException e) {
            log.error("[user-list] list JDBC error: {}", e.getMessage(), e);
            throw GlobalException.of(ValidationMessageEnum.FAILED_LOAD_USERS);
        }
    }

    private static MapSqlParameterSource queryParams(UserListFilter filter) {
        return new MapSqlParameterSource()
                .addValue("role", filter.getRole())
                .addValue("activeFilter", filter.getActiveFilter())
                .addValue("searchField", filter.getSearchField())
                .addValue("searchText", filter.getSearchText());
    }

    private static int clampPageSize(int pageSize) {
        if (pageSize < 1) {
            return 1;
        }
        return Math.min(pageSize, 100);
    }
}
