package com.gestaooficina.repository;

import com.gestaooficina.model.response.UserListItemResponse;

import java.util.List;

public interface AdminUserListRepository {

    long countUsers(String role, String activeFilter, String searchField, String searchText);

    List<UserListItemResponse> findUsersPage(String role, String activeFilter, String searchField,
                                             String searchText, int page, int pageSize);
}
