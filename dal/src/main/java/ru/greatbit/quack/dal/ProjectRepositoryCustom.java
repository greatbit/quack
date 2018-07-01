package ru.greatbit.quack.dal;

import ru.greatbit.quack.beans.Project;

import java.util.List;

public interface ProjectRepositoryCustom {

    List<Project> findByOrganizationId(String id);
}
