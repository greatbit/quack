package ru.greatbit.quack.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.greatbit.quack.beans.User;
import ru.greatbit.quack.dal.CommonRepository;
import ru.greatbit.quack.dal.UserRepository;

@Service
public class UserService extends BaseService<User> {

    @Autowired
    private UserRepository repository;

    @Override
    protected CommonRepository<User> getRepository() {
        return repository;
    }

}
