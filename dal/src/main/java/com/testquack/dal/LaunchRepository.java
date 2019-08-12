package com.testquack.dal;

import org.springframework.data.repository.PagingAndSortingRepository;
import com.testquack.beans.Launch;

public interface LaunchRepository extends LaunchRepositoryCustom,
        PagingAndSortingRepository<Launch, String>, CommonRepository<Launch> {
}
