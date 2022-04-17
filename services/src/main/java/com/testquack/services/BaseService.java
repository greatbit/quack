package com.testquack.services;

import com.hazelcast.core.HazelcastInstance;
import com.hazelcast.cp.lock.FencedLock;
import com.testquack.beans.Organization;
import com.testquack.dal.OrganizationRepository;
import com.testquack.services.errors.EntityAccessDeniedException;
import com.testquack.services.errors.EntityNotFoundException;
import com.testquack.services.errors.EntityValidationException;
import com.testquack.services.errors.OrganizationNotSetException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import com.testquack.beans.Entity;
import com.testquack.beans.Filter;
import com.testquack.beans.Project;
import com.testquack.dal.CommonRepository;
import com.testquack.dal.ProjectRepository;
import ru.greatbit.whoru.auth.Session;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import static java.lang.String.format;
import static java.util.stream.Collectors.joining;
import static org.apache.commons.lang3.StringUtils.isEmpty;

public abstract class BaseService<E extends Entity> {
    protected final Logger logger = Logger.getLogger(getClass().getName());

    public final static String CURRENT_ORGANIZATION_KEY = "currentOrganization";
    public final static String ORGANIZATIONS_KEY = "organizations";
    public final static String ORGANIZATIONS_ENABLED_KEY = "organizationsEnabled";

    @Value("${quack.organizations.enabled}")
    protected boolean organizationsEnabled;

    @Value("${entity.lock.ttl.min}")
    protected long lockTtl;

    @Autowired
    protected HazelcastInstance hazelcastInstance;

    @Autowired
    protected ProjectRepository projectRepository;

    @Autowired
    protected OrganizationRepository organizationRepository;

    protected abstract CommonRepository<E> getRepository();

    public List<E> findAll(Session session, String projectId){
        throw new UnsupportedOperationException();
    }

    public List<E> findFiltered(Session session, String projectId, Filter filter){
        return userCanReadProject(session, projectId) ?
                getRepository().find(getCurrOrganizationId(session), projectId, filter).stream()
                        .map(entity -> beforeReturn(session, projectId, entity)).collect(Collectors.toList()) :
                Collections.emptyList();
    }

    public E findOneUnfiltered(Session session, String projectId, String id){
        E entity = getRepository().findOne(getCurrOrganizationId(session), projectId, id);
        if (entity == null){
            throw new EntityNotFoundException();
        }
        if (!userCanRead(session, projectId, entity)) {
            throw new EntityAccessDeniedException(
                    format("User %s can't read entity %s", session.getPerson().getLogin(), id)
            );
        }
        return entity;
    }

    public E findOne(Session session, String projectId, String id){
        E entity = findOneUnfiltered(session, projectId, id);
        return beforeReturn(session, projectId, entity);
    }

    public E save(Session user, String projectId, E entity){
        if (!userCanSave(user, projectId, entity)){
            throw new EntityAccessDeniedException(
                    format("User %s can't save entity %s", user.getPerson().getLogin(), entity.getId())
            );
        }
        return isEmpty(entity.getId()) ?
                create(user, projectId, entity) :
                update(user, projectId, entity, (origEnt, newEnt) -> newEnt);
    }

    public Collection<E> save(Session user, String projectId, Collection<E> entities){
        if (!userCanSave(user, projectId, entities)){
            throw new EntityAccessDeniedException(
                    format("User %s can't save entities %s",
                            user.getPerson().getLogin(),
                            entities.stream().map(obj -> obj == null ? "null" : obj.toString()).collect(joining(", ")))
            );
        }
        return getRepository().save(getCurrOrganizationId(user), projectId, entities);
    }


    public void delete(Session session, String projectId, String id){
        beforeDelete(session, projectId, id);
        if (!userCanDelete(session, projectId, id)){
            throw new EntityAccessDeniedException(
                    format("User %s can't delete entity %s", session.getPerson().getLogin(), id)
            );
        }
        E entity = findOne(session, projectId, id);
        entity.setDeleted(true);
        getRepository().save(getCurrOrganizationId(session), projectId, entity);
        afterDelete(session, projectId, id);
    }

    public long count(Session session, String projectId, Filter filter){
        return userCanReadProject(session, projectId) ?
            getRepository().count(getCurrOrganizationId(session), projectId, filter) : 0;
    }


    protected boolean userCanRead(Session session, String projectId, E entity){
        return userCanReadProject(session, projectId);
    }
    protected boolean userCanUpdateProject(Session session, String projectId){
        return userCanReadProject(session, projectId);

    }
    protected boolean userCanReadProject(Session session, String projectId){
        if (session.isIsAdmin()){
            return true;
        }
        Organization organization = organizationRepository.findOne(null, null, getCurrOrganizationId(session));
        if (!isUserInOrganization(session, organization)){
            return false;
        }
        if (isUserOrganizationAdmin(session, organization)){
            return true;
        }
        Project project = projectRepository.findOne(getCurrOrganizationId(session), null, projectId);
        if (project.isDeleted()) {
            throw new EntityNotFoundException(format("Project %s does not exist", projectId));
        }
        return project.getReadWriteGroups().stream().anyMatch(session.getPerson().getGroups()::contains) ||
                project.getReadWriteUsers().stream().anyMatch(session.getPerson().getLogin()::equals);

    }
    protected boolean userCanSave(Session session, String projectId, E entity){
        return session.isIsAdmin() || userCanUpdateProject(session, projectId);
    }
    protected boolean userCanSave(Session session, String projectId, Collection<E> entities) {
        return session.isIsAdmin() || userCanUpdateProject(session, projectId);
    }
    protected boolean userCanDelete(Session session, String projectId, String id){
        return session.isIsAdmin() || userCanUpdateProject(session, projectId);
    }
    protected boolean userCanCreate(Session session, String projectId, E entity){
        return session.isIsAdmin() || userCanUpdateProject(session, projectId);
    }
    protected boolean userCanUpdate(Session session, String projectId, E entity){
        return session.isIsAdmin() || userCanUpdateProject(session, projectId);
    }

    protected void beforeCreate(Session session, String projectId, E entity){
        if (!isEmpty(entity.getId()) && getRepository().exists(getCurrOrganizationId(session), projectId, entity.getId())){
            throw new EntityValidationException(format("Entity with id [%s] already exists", entity.getId()));
        }
        entity.setCreatedTime(System.currentTimeMillis());
        entity.setCreatedBy(session.getPerson().getLogin());
        if (entity.getName() == "") {
            entity.setName(entity.getClass().getSimpleName());
        }
    }

    protected void afterCreate(Session session, String projectId, E entity) {
    }

    protected void beforeUpdate(Session session, String projectId, E existingEntity, E entity) {
    }

    protected void afterUpdate(Session session, String projectId, E previousEntity, E entity) {
    }

    protected void beforeSave(Session session, String projectId, E entity) {
        entity.setLastModifiedTime(System.currentTimeMillis());
        entity.setLastModifiedBy(session.getLogin());
    }

    protected void afterSave(Session session, String projectId, E entity) {
    }

    protected void beforeDelete(Session session, String projectId, String id) {
    }

    protected void afterDelete(Session session, String projectId, String id) {
    }

    protected E beforeReturn(Session session, String projectId, E entity) {
        return entity;
    }


    protected boolean validateEntity(E ent){
        return true;
    }

    protected E create(Session session, String projectId, E entity){
        beforeCreate(session, projectId, entity);
        if (!userCanCreate(session, projectId, entity)){
            throw new EntityAccessDeniedException(getAccessDeniedMessage(session, entity, "CREATE"));
        }
        entity = doSave(session, projectId, entity);
        afterCreate(session, projectId, entity);
        return entity;
    }

    protected E update(Session session, String projectId, E entity){
        return update(session, projectId, entity, (savedEnt, newEnt) -> newEnt);
    }

    protected E update(Session session, String projectId, E entity, UpdatableEntityConvertor converter) {
        if (!userCanUpdate(session, projectId, entity)){
            throw new EntityAccessDeniedException(getAccessDeniedMessage(session, entity, "UPDATE"));
        }
        FencedLock lock = hazelcastInstance.getCPSubsystem().getLock(entity.getClass() + entity.getId());
        try{
            lock.tryLock(lockTtl, TimeUnit.MINUTES);
            E existingEntity = findOneUnfiltered(session, projectId, entity.getId());
            beforeUpdate(session, projectId, existingEntity, entity);
            if (existingEntity != null) {
                if (existingEntity.getLastModifiedTime() > entity.getLastModifiedTime()) {
                    throw new EntityValidationException("Entity has been changed previously. Changes will cause lost updates.");
                }
                entity = (E) converter.transform(existingEntity, entity);
            }
            entity = doSave(session, projectId, entity);
            afterUpdate(session, projectId, existingEntity, entity);
            return entity;
        } finally {
            lock.unlock();
        }
    }

    private E doSave(Session session, String projectId, E entity){
        beforeSave(session, projectId, entity);
        if (validateEntity(entity)){
            entity = getRepository().save(getCurrOrganizationId(session), projectId, entity);
            afterSave(session, projectId, entity);
            return entity;
        } else throw new EntityValidationException(getAccessDeniedMessage(session, entity, "SAVE"));
    }

    protected String getAccessDeniedMessage(Session session, E ent, String action){
        String login = session != null && session.getPerson() != null ? session.getPerson().getLogin() : "unknown";
        String entId = ent != null && ent.getId() != null ? ent.getId().toString() : "new entity";
        return format("User %s doesn't have %s permissions on %s", login, action, entId);
    }

    protected boolean exists(Session session, String projectId, String entityId) {
        return getRepository().exists(getCurrOrganizationId(session), projectId, entityId);
    }

    public void delete(Session session, String projectId, Filter filter) {
        if (userCanUpdateProject(session, projectId)) {
            findFiltered(session, projectId, filter).forEach(entity -> {
                entity.setDeleted(true);
                getRepository().save(getCurrOrganizationId(session), projectId, entity);
            });
        }
    }

    public String getCurrOrganizationId(Session session){
        return (String) session.getMetainfo().get(CURRENT_ORGANIZATION_KEY);
    }

    protected boolean isUserInOrganization(Session session){
        return isUserInOrganization(session, getCurrOrganizationId(session));
    }

    protected boolean isUserInOrganization(Session session, String organizationId){
        if (organizationsEnabled){
            if (organizationId == null){
                throw new OrganizationNotSetException("Organization not set for session");
            }
            Organization organization = organizationRepository.findOne(null, null, organizationId);
            return isUserInOrganization(session, organization);
        }
        return true;
    }

    protected boolean isUserInOrganization(Session session, Organization organization){
        if (organizationsEnabled) {
            if (organization == null || organization.isDeleted()) {
                throw new EntityNotFoundException(format("Organization %s does not exist", organization.getId()));
            }
            return organization.getAllowedGroups().stream().anyMatch(session.getPerson().getGroups()::contains) ||
                    organization.getAllowedUsers().stream().anyMatch(session.getPerson().getLogin()::equals) ||
                    organization.getAdmins().stream().anyMatch(session.getPerson().getLogin()::equals);
        }
        return true;
    }

    protected boolean isUserOrganizationAdmin(Session session){
        if (organizationsEnabled){
            String currOrganizationId = getCurrOrganizationId(session);
            if (currOrganizationId == null){
                throw new OrganizationNotSetException("Organization not set for session");
            }
            Organization organization = organizationRepository.findOne(null, null, currOrganizationId);
            return isUserOrganizationAdmin(session, organization);
        }
        return false;
    }

    protected boolean isUserOrganizationAdmin(Session session, Organization organization){
        if (organizationsEnabled) {
            if (organization.isDeleted()) {
                throw new EntityNotFoundException(format("Organization %s does not exist", organization.getId()));
            }
            return organization.getAdmins().stream().anyMatch(session.getPerson().getLogin()::equals);
        } return false;
    }
}
