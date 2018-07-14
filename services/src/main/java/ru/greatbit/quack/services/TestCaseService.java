package ru.greatbit.quack.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.greatbit.quack.beans.TestCase;
import ru.greatbit.quack.dal.CommonRepository;
import ru.greatbit.quack.dal.TestCaseRepository;

@Service
public class TestCaseService extends BaseService<TestCase> {

    @Autowired
    private TestCaseRepository repository;

    @Override
    protected CommonRepository<TestCase> getRepository() {
        return repository;
    }

}
