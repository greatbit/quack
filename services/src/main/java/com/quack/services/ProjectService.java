package com.quack.services;

import com.quack.services.errors.EntityValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.quack.beans.Filter;
import com.quack.beans.Project;
import com.quack.dal.CommonRepository;
import com.quack.dal.ProjectRepository;
import ru.greatbit.whoru.auth.Session;

import java.util.List;

import static java.lang.String.format;
import static java.util.stream.Collectors.toList;
import static org.apache.commons.lang3.StringUtils.isEmpty;

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
        if (isEmpty(entity.getId())) {
            throw new EntityValidationException("Project ID must not be empty");
        }
        if (entity.getId().length() < 3) {
            throw new EntityValidationException("Project ID must contain at least 3 characters");
        }
        super.beforeCreate(session, projectId, entity);
        sequencerService.create(projectId);
    }

    public Project createProject(Session user, Project entity) {
        if (entity.getId() != null && repository.exists(null, entity.getId())) {
            throw new EntityValidationException(format("Project with id %s already exists", entity.getId()));
        }
        return create(user, null, entity);
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
