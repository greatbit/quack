package ru.greatbit.quack.dal;

import org.springframework.data.repository.PagingAndSortingRepository;
import ru.greatbit.quack.beans.TestSuite;

public interface TestSuiteRepository extends TestSuiteRepositoryCustom,
        PagingAndSortingRepository<TestSuite, String>, CommonRepository<TestSuite> {
}
