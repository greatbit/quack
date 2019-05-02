package com.quack.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.quack.beans.ProjectGroup;
import com.quack.dal.CommonRepository;
import com.quack.dal.ProjectGroupRepository;
import ru.greatbit.whoru.auth.Session;

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
