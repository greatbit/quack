package com.testquack.dal;

import org.springframework.data.repository.PagingAndSortingRepository;
import com.testquack.beans.TestCase;

public interface TestCaseRepository extends TestCaseRepositoryCustom,
        PagingAndSortingRepository<TestCase, String>, CommonRepository<TestCase> {
}
