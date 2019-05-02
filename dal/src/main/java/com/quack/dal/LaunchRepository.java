package com.quack.dal;

import org.springframework.data.repository.PagingAndSortingRepository;
import com.quack.beans.Launch;

public interface LaunchRepository extends LaunchRepositoryCustom,
        PagingAndSortingRepository<Launch, String>, CommonRepository<Launch> {
}
