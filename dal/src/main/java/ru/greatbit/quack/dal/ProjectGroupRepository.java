package ru.greatbit.quack.dal;

import org.springframework.data.repository.PagingAndSortingRepository;
import ru.greatbit.quack.beans.ProjectGroup;

public interface ProjectGroupRepository extends ProjectGroupRepositoryCustom,
        PagingAndSortingRepository<ProjectGroup, String>, CommonRepository<ProjectGroup> {
}
