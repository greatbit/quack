package ru.greatbit.quack.dal;

import org.springframework.data.repository.PagingAndSortingRepository;
import ru.greatbit.quack.beans.User;

public interface UserRepository extends UserRepositoryCustom,
        PagingAndSortingRepository<User, String>, CommonRepository<User> {
}
