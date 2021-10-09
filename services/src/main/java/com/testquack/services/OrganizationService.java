package com.testquack.services;

import com.testquack.beans.Filter;
import com.testquack.beans.Organization;
import com.testquack.dal.CommonRepository;
import com.testquack.dal.OrganizationRepository;
import com.testquack.dal.UserRepository;
import com.testquack.services.errors.EntityValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import ru.greatbit.whoru.auth.Session;

import java.util.List;

import static java.lang.String.format;
import static java.util.stream.Collectors.toList;
import static org.apache.commons.lang3.StringUtils.isEmpty;

@Service
public class OrganizationService extends BaseService<Organization> {

    @Value("${quack.organization.default.sessions.capacity}")
    public int defaultSessionCapacity;

    @Autowired
    private OrganizationRepository repository;

    @Autowired
    private SequencerService sequencerService;

    @Autowired
    private UserRepository userRepository;

    @Override
    protected CommonRepository<Organization> getRepository() {
        return repository;
    }

    @Override
    protected void beforeCreate(Session session, String projectId, Organization entity) {
        if (isEmpty(entity.getId())) {
            throw new EntityValidationException("Organization ID must not be empty");
        }
        if (entity.getId().length() < 3) {
            throw new EntityValidationException("Organization ID must contain at least 3 characters");
        }
        entity.setLicenseCapacity(defaultSessionCapacity);
        super.beforeCreate(session, projectId, entity);
    }

    public Organization createOrganization(Session user, Organization entity) {
        if (entity.getId() != null && repository.exists(null,null, entity.getId())) {
            throw new EntityValidationException(format("Organization with id %s already exists", entity.getId()));
        }
        entity.getAdmins().add(user.getLogin());
        entity.getAllowedUsers().add(user.getLogin());
        return create(user, null, entity);
    }

    @Override
    public List<Organization> findFiltered(Session session, String projectId, Filter filter) {
        return getRepository().find(null, projectId, filter).stream().filter(
                organization -> session.isIsAdmin() ||
                        organization.getAllowedGroups().stream().anyMatch(session.getPerson().getGroups()::contains) ||
                        organization.getAllowedUsers().stream().anyMatch(session.getPerson().getLogin()::equals) ||
                        organization.getAdmins().stream().anyMatch(session.getPerson().getLogin()::equals)
        ).collect(toList());
    }

    @Override
    protected boolean userCanCreate(Session session, String projectId, Organization organization){
        return true;
    }

    @Override
    protected boolean userCanDelete(Session session, String projectId, String id){
        return session.isIsAdmin() || isUserOrganizationAdmin(session);
    }

    @Override
    protected boolean userCanRead(Session session, String projectId, Organization entity) {
        return session.isIsAdmin() || isUserInOrganization(session);
    }

    @Override
    protected boolean userCanUpdate(Session session, String projectId, Organization organization){
        return session.isIsAdmin() || isUserOrganizationAdmin(session);
    }

    @Override
    protected void beforeUpdate(Session session, String projectId, Organization existingEntity, Organization entity) {
        if (!session.isIsAdmin()){
            entity.setLicenseCapacity(existingEntity.getLicenseCapacity());
            entity.setLicenseExpiration(existingEntity.getLicenseExpiration());
        }
        super.beforeUpdate(session, projectId, existingEntity, entity);
    }
}
