package com.quack.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.quack.beans.Filter;
import com.quack.beans.Project;
import com.quack.dal.CommonRepository;
import com.quack.dal.ProjectRepository;
import ru.greatbit.whoru.auth.Session;

import java.util.List;

import static java.util.stream.Collectors.toList;

@Service
public class ProjectService extends BaseService<Project> {

    @Autowired
    private ProjectRepository repository;

    @Autowired
    private SequencerService sequencerService;

    @Override
    protected CommonRepository<Project> getRepository() {
        return repository;
    }

    @Override
    protected void beforeCreate(Session session, String projectId, Project entity) {
        super.beforeCreate(session, projectId, entity);
        sequencerService.create(projectId);
    }

    @Override
    public List<Project> findFiltered(Session session, String projectId, Filter filter) {
        return getRepository().find(projectId, filter).stream().filter(
                project -> session.isIsAdmin() || 
                        project.getAllowedGroups().stream().anyMatch(session.getPerson().getGroups()::contains
                        )
        ).collect(toList());
    }
}
