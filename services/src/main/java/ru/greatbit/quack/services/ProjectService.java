package ru.greatbit.quack.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.greatbit.quack.beans.Attribute;
import ru.greatbit.quack.beans.Project;
import ru.greatbit.quack.beans.Session;
import ru.greatbit.quack.dal.AttributeRepository;
import ru.greatbit.quack.dal.CommonRepository;
import ru.greatbit.quack.dal.ProjectRepository;

@Service
public class ProjectService extends BaseService<Project> {

    @Autowired
    ProjectRepository repository;

    @Override
    protected CommonRepository<Project> getRepository() {
        return repository;
    }

    @Override
    protected boolean userCanRead(Session session, String projectId, Project entity) {
        return userCanRead(session, projectId);
    }

    public boolean userCanRead(Session session, String projectId){
        return true;
    }
}
