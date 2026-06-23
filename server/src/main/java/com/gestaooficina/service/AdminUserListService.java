package com.gestaooficina.service;

import com.gestaooficina.exception.GlobalException;
import com.gestaooficina.model.enums.ValidationMessageEnum;
import com.gestaooficina.model.response.UserListItemResponse;
import com.gestaooficina.model.request.UserListRequest;
import com.gestaooficina.model.response.UserListResponse;
import com.gestaooficina.repository.AdminUserListJdbcRepository;
import com.gestaooficina.repository.AuthJdbcRepository;
import com.gestaooficina.repository.filter.UserEmailFilter;
import com.gestaooficina.repository.filter.UserListFilter;
import com.gestaooficina.model.record.UserRecord;
import com.gestaooficina.utils.UserValidationUtils;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminUserListService {

    private final AuthJdbcRepository authJdbcRepository;
    private final AdminUserListJdbcRepository adminUserListJdbcRepository;

    public AdminUserListService(AuthJdbcRepository authJdbcRepository,
                                AdminUserListJdbcRepository adminUserListJdbcRepository) {
        this.authJdbcRepository = authJdbcRepository;
        this.adminUserListJdbcRepository = adminUserListJdbcRepository;
    }

    public UserListResponse getList(String requesterEmail, UserListRequest request) {
        requireAdmin(requesterEmail);

        UserListRequest source = request != null ? request : new UserListRequest();
        int page = source.getPage() != null ? source.getPage() : 0;
        int pageSize = source.getPageSize() != null ? source.getPageSize() : 20;
        UserValidationUtils.validatePagination(page, pageSize);

        UserListFilter filter = new UserListFilter(
                UserValidationUtils.normalizeRoleFilter(source.getRole()),
                UserValidationUtils.normalizeActiveFilter(source.getActiveFilter()),
                UserValidationUtils.normalizeSearchFieldFilter(source.getSearchField()),
                UserValidationUtils.normalizeSearchText(source.getSearchText()),
                source.getPage(),
                source.getPageSize());

        long totalNumber = Math.max(adminUserListJdbcRepository.countUsers(filter), 0L);

        int resolvedPageSize = filter.getPageSizeOrDefault();
        int requestedPage = Math.max(filter.getPageOrDefault(), 0);
        int pageMaxNumber = totalNumber <= 0 ? 0 : (int) ((totalNumber - 1) / resolvedPageSize);
        int safePage = Math.min(requestedPage, pageMaxNumber);

        List<UserListItemResponse> items = adminUserListJdbcRepository.findUsersPage(
                filter.withPage(safePage, resolvedPageSize));

        return new UserListResponse(items, totalNumber, safePage, resolvedPageSize, pageMaxNumber);
    }

    private void requireAdmin(String email) {
        UserRecord requester = authJdbcRepository.findByEmail(new UserEmailFilter(email))
                .orElseThrow(() -> GlobalException.of(ValidationMessageEnum.UNAUTHORIZED));
        if (!requester.getRole().isAdmin()) {
            throw GlobalException.of(ValidationMessageEnum.ACCESS_DENIED);
        }
    }
}
