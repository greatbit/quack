package com.quack.dal;

import org.springframework.data.repository.PagingAndSortingRepository;
import com.quack.beans.ProjectGroup;

public interface ProjectGroupRepository extends ProjectGroupRepositoryCustom,
        PagingAndSortingRepository<ProjectGroup, String>, CommonRepository<ProjectGroup> {
}
