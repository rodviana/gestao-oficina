package com.gestaooficina.service;

import com.gestaooficina.model.request.UserListRequest;
import com.gestaooficina.model.response.UserListItemResponse;
import com.gestaooficina.model.response.UserListResponse;
import com.gestaooficina.repository.AdminUserListRepository;
import com.gestaooficina.utils.UserValidationUtils;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminUserListService {

    private final AuthSupport authSupport;
    private final AdminUserListRepository adminUserListRepository;

    public AdminUserListService(AuthSupport authSupport,
                                AdminUserListRepository adminUserListRepository) {
        this.authSupport = authSupport;
        this.adminUserListRepository = adminUserListRepository;
    }

    public UserListResponse getList(String requesterEmail, UserListRequest request) {
        authSupport.requireAdmin(requesterEmail);

        UserListRequest source = request != null ? request : new UserListRequest();
        int page = source.getPage() != null ? source.getPage() : 0;
        int pageSize = source.getPageSize() != null ? source.getPageSize() : 20;
        UserValidationUtils.validatePagination(page, pageSize);

        String role = UserValidationUtils.normalizeRoleFilter(source.getRole());
        String activeFilter = UserValidationUtils.normalizeActiveFilter(source.getActiveFilter());
        String searchField = UserValidationUtils.normalizeSearchFieldFilter(source.getSearchField());
        String searchText = UserValidationUtils.normalizeSearchText(source.getSearchText());

        long totalNumber = Math.max(
                adminUserListRepository.countUsers(role, activeFilter, searchField, searchText), 0L);

        int pageMaxNumber = totalNumber <= 0 ? 0 : (int) ((totalNumber - 1) / pageSize);
        int safePage = Math.min(page, pageMaxNumber);

        List<UserListItemResponse> items = adminUserListRepository.findUsersPage(
                role, activeFilter, searchField, searchText, safePage, pageSize);

        return new UserListResponse(items, totalNumber, safePage, pageSize, pageMaxNumber);
    }
}
