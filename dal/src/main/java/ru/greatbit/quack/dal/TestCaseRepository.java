package ru.greatbit.quack.dal;

import org.springframework.data.repository.PagingAndSortingRepository;
import ru.greatbit.quack.beans.TestCase;

public interface TestCaseRepository extends TestCaseRepositoryCustom,
        PagingAndSortingRepository<TestCase, String>, CommonRepository<TestCase> {
}
