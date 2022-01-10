package com.testquack.services;

import com.testquack.beans.Organization;
import com.testquack.services.errors.EntityValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.testquack.beans.Filter;
import com.testquack.beans.Project;
import com.testquack.dal.CommonRepository;
import com.testquack.dal.ProjectRepository;
import ru.greatbit.whoru.auth.Session;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

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
        sequencerService.create(getCurrOrganizationId(session), projectId);
    }

    public Project createProject(Session user, Project entity) {
        if (entity.getId() != null && repository.exists(getCurrOrganizationId(user), null, entity.getId())) {
            throw new EntityValidationException(format("Project with id %s already exists", entity.getId()));
        }
        return create(user, null, entity);
    }

    @Override
    public List<Project> findFiltered(Session session, String projectId, Filter filter) {
        return getRepository().find(getCurrOrganizationId(session), projectId, filter).stream().filter(
                project -> session.isIsAdmin() || isUserOrganizationAdmin(session) ||  
                        project.getReadWriteGroups().stream().anyMatch(session.getPerson().getGroups()::contains) ||
                        project.getReadWriteUsers().stream().anyMatch(session.getPerson().getLogin()::equals)
        ).collect(toList());
    }

    @Override
    protected void beforeSave(Session session, String projectId, Project project) {
        super.beforeSave(session, projectId, project);
        project.getLauncherConfigs().forEach(launcherConfig -> {
            if (isEmpty(launcherConfig.getUuid())) {
                launcherConfig.setUuid(UUID.randomUUID().toString());
            }
            if (isEmpty(launcherConfig.getName())) {
                launcherConfig.setName(launcherConfig.getLauncherId());
            }
        });
    }

    @Override
    protected boolean userCanCreate(Session session, String projectId, Project project){
        if (!organizationsEnabled){
            return super.userCanCreate(session, projectId, project);
        }
        Organization organization = organizationRepository.findOne(null, null, getCurrOrganizationId(session));
        return session.isIsAdmin() || (organization != null && organization.getAdmins().contains(session.getPerson().getLogin()));
    }

}
