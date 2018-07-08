package ru.greatbit.quack.dal;

import org.springframework.data.repository.PagingAndSortingRepository;
import ru.greatbit.quack.beans.Project;
import ru.greatbit.quack.beans.TestCase;

public interface TestcaseRepository extends TestcaseRepositoryCustom,
        PagingAndSortingRepository<TestCase, String>, CommonRepository<TestCase> {
}
