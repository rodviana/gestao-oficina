package com.gestaooficina.repository;

import com.gestaooficina.model.response.UserListItemResponse;
import com.gestaooficina.repository.filter.UserListFilter;

import java.util.List;

public interface AdminUserListJdbcRepository {

    String SQL_COUNT_USERS =
            "SELECT p_count_users_filtered(:role, :activeFilter, :searchField, :searchText)";

    String SQL_FIND_USERS =
            "SELECT * FROM p_find_users_filtered(:role, :activeFilter, :searchField, :searchText, :page, :pageSize)";

    long countUsers(UserListFilter filter);

    List<UserListItemResponse> findUsersPage(UserListFilter filter);
}
