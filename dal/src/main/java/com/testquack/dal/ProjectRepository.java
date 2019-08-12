package com.testquack.dal;

import org.springframework.data.repository.PagingAndSortingRepository;
import com.testquack.beans.Project;

public interface ProjectRepository extends ProjectRepositoryCustom,
        PagingAndSortingRepository<Project, String>, CommonRepository<Project> {
}
