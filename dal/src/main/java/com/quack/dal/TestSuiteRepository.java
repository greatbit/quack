package com.quack.dal;

import org.springframework.data.repository.PagingAndSortingRepository;
import com.quack.beans.TestSuite;

public interface TestSuiteRepository extends TestSuiteRepositoryCustom,
        PagingAndSortingRepository<TestSuite, String>, CommonRepository<TestSuite> {
}
