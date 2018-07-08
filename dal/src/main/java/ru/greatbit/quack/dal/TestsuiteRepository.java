package ru.greatbit.quack.dal;

import org.springframework.data.repository.PagingAndSortingRepository;
import ru.greatbit.quack.beans.Attribute;
import ru.greatbit.quack.beans.TestSuite;

public interface TestsuiteRepository extends TestsuiteRepositoryCustom,
        PagingAndSortingRepository<TestSuite, String>, CommonRepository<TestSuite> {
}
