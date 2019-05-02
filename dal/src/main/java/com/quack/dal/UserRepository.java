package com.quack.dal;

import org.springframework.data.repository.PagingAndSortingRepository;
import com.quack.beans.User;

public interface UserRepository extends UserRepositoryCustom,
        PagingAndSortingRepository<User, String>, CommonRepository<User> {
}
