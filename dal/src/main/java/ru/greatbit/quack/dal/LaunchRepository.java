package ru.greatbit.quack.dal;

import org.springframework.data.repository.PagingAndSortingRepository;
import ru.greatbit.quack.beans.Launch;

public interface LaunchRepository extends LaunchRepositoryCustom,
        PagingAndSortingRepository<Launch, String>, CommonRepository<Launch> {
}
