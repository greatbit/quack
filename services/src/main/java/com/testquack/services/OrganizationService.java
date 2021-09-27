package com.testquack.services;

import com.testquack.beans.Filter;
import com.testquack.beans.Organization;
import com.testquack.beans.User;
import com.testquack.dal.CommonRepository;
import com.testquack.dal.OrganizationRepository;
import com.testquack.dal.UserRepository;
import com.testquack.services.errors.EntityValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.greatbit.utils.collection.CollectionUtils;
import ru.greatbit.utils.collection.Difference;
import ru.greatbit.whoru.auth.Session;

import java.util.List;

import static java.lang.String.format;
import static java.util.stream.Collectors.toList;
import static org.apache.commons.lang3.StringUtils.isEmpty;

@Service
public class OrganizationService extends BaseService<Organization> {

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
        super.beforeCreate(session, projectId, entity);
        sequencerService.create(projectId);
    }

    public Organization createOrganization(Session user, Organization entity) {
        if (entity.getId() != null && repository.exists(null,null, entity.getId())) {
            throw new EntityValidationException(format("Organization with id %s already exists", entity.getId()));
        }
        entity.getAdmins().add(user.getId());
        entity.getAllowedUsers().add(user.getId());
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
    protected void beforeUpdate(Session session, String projectId, Organization existingEntity, Organization entity) {
        super.beforeUpdate(session, projectId, existingEntity, entity);

        Difference<String> usersDiff = CollectionUtils.getDiff(existingEntity.getAllowedUsers(), entity.getAllowedUsers());
        usersDiff.getAdded().forEach(addedUserId -> {
            User user = userRepository.findOne(null, projectId, addedUserId);
            if (!user.getOrganizations().contains(entity.getId())){
                user.getOrganizations().add(entity.getId());
            }
            userRepository.save(user);
        });
        usersDiff.getRemoved().forEach(removedUserId -> {
            User user = userRepository.findOne(null, projectId, removedUserId);
            if (user.getOrganizations().contains(entity.getId())){
                user.getOrganizations().remove(entity.getId());
            }
            userRepository.save(user);
        });


        Difference<String> adminsDiff = CollectionUtils.getDiff(existingEntity.getAdmins(), entity.getAdmins());
        adminsDiff.getAdded().forEach(addedUserId -> {
            User user = userRepository.findOne(null, projectId, addedUserId);
            if (!user.getAdminOfOrganizations().contains(entity.getId())){
                user.getAdminOfOrganizations().add(entity.getId());
            }
            userRepository.save(user);
        });
        adminsDiff.getRemoved().forEach(removedUserId -> {
            User user = userRepository.findOne(null, projectId, removedUserId);
            if (user.getAdminOfOrganizations().contains(entity.getId()) &&
                    !session.getPerson().getLogin().equals(removedUserId)){
                user.getAdminOfOrganizations().remove(entity.getId());
            }
            userRepository.save(user);
        });

    }
}
