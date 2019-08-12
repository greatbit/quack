package com.testquack.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.testquack.beans.TestSuite;
import com.testquack.dal.CommonRepository;
import com.testquack.dal.TestSuiteRepository;
import ru.greatbit.whoru.auth.Session;

@Service
public class TestSuiteService extends BaseService<TestSuite> {

    @Autowired
    private TestSuiteRepository repository;

    @Override
    protected CommonRepository<TestSuite> getRepository() {
        return repository;
    }

    @Override
    protected void beforeSave(Session session, String projectId, TestSuite testSuite) {
        super.beforeSave(session, projectId, testSuite);
        if (testSuite.getFilter() != null) {
            testSuite.getFilter().setLimit(0);
            testSuite.getFilter().setSkip(0);
        }
    }
}
