package com.testquack.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.testquack.beans.ProjectGroup;
import com.testquack.dal.CommonRepository;
import com.testquack.dal.ProjectGroupRepository;
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
