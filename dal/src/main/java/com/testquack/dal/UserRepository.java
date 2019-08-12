package com.testquack.dal;

import org.springframework.data.repository.PagingAndSortingRepository;
import com.testquack.beans.User;

public interface UserRepository extends UserRepositoryCustom,
        PagingAndSortingRepository<User, String>, CommonRepository<User> {
}
