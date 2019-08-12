package com.testquack.dal;

import org.springframework.data.repository.PagingAndSortingRepository;
import com.testquack.beans.TestSuite;

public interface TestSuiteRepository extends TestSuiteRepositoryCustom,
        PagingAndSortingRepository<TestSuite, String>, CommonRepository<TestSuite> {
}
