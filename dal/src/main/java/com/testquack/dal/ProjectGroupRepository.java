package com.testquack.dal;

import org.springframework.data.repository.PagingAndSortingRepository;
import com.testquack.beans.ProjectGroup;

public interface ProjectGroupRepository extends ProjectGroupRepositoryCustom,
        PagingAndSortingRepository<ProjectGroup, String>, CommonRepository<ProjectGroup> {
}
