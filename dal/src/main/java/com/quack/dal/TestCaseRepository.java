package com.quack.dal;

import org.springframework.data.repository.PagingAndSortingRepository;
import com.quack.beans.TestCase;

public interface TestCaseRepository extends TestCaseRepositoryCustom,
        PagingAndSortingRepository<TestCase, String>, CommonRepository<TestCase> {
}
