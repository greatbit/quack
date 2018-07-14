package ru.greatbit.quack.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.greatbit.quack.beans.TestSuite;
import ru.greatbit.quack.dal.CommonRepository;
import ru.greatbit.quack.dal.TestSuiteRepository;

@Service
public class TestSuiteService extends BaseService<TestSuite> {

    @Autowired
    private TestSuiteRepository repository;

    @Override
    protected CommonRepository<TestSuite> getRepository() {
        return repository;
    }

}
