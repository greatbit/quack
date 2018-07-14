package ru.greatbit.quack.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.greatbit.quack.beans.Launch;
import ru.greatbit.quack.dal.CommonRepository;
import ru.greatbit.quack.dal.LaunchRepository;

@Service
public class LaunchService extends BaseService<Launch> {

    @Autowired
    private LaunchRepository repository;

    @Override
    protected CommonRepository<Launch> getRepository() {
        return repository;
    }

}
