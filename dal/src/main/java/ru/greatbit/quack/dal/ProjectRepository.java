package ru.greatbit.quack.dal;

import org.springframework.data.repository.PagingAndSortingRepository;
import ru.greatbit.quack.beans.Project;

public interface ProjectRepository extends ProjectRepositoryCustom,
        PagingAndSortingRepository<Project, String> {
}
