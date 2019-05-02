package com.quack.dal;

import org.springframework.data.repository.PagingAndSortingRepository;
import com.quack.beans.Project;

public interface ProjectRepository extends ProjectRepositoryCustom,
        PagingAndSortingRepository<Project, String>, CommonRepository<Project> {
}
