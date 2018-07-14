package ru.greatbit.quack.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.greatbit.quack.beans.ProjectGroup;
import ru.greatbit.quack.beans.Session;
import ru.greatbit.quack.dal.CommonRepository;
import ru.greatbit.quack.dal.ProjectGroupRepository;

@Service
public class ProjectGroupService extends BaseService<ProjectGroup> {

    @Autowired
    private ProjectGroupRepository repository;

    @Override
    protected CommonRepository<ProjectGroup> getRepository() {
        return repository;
    }

    @Override
    protected boolean userCanRead(Session session, String projectId, ProjectGroup entity) {
        return true;
    }
}
