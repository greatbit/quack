package ru.greatbit.quack.services;

import org.springframework.beans.factory.annotation.Autowired;
import ru.greatbit.quack.beans.Entity;
import ru.greatbit.quack.beans.Filter;
import ru.greatbit.quack.beans.Session;
import ru.greatbit.quack.dal.CommonRepository;
import ru.greatbit.quack.services.errors.EntityAccessDeniedException;
import ru.greatbit.quack.services.errors.EntityNotFoundException;
import ru.greatbit.quack.services.errors.EntityValidationException;

import java.util.Collection;
import java.util.List;
import java.util.logging.Logger;

import static java.lang.String.format;
import static java.util.stream.Collectors.joining;
import static org.apache.commons.lang3.StringUtils.isEmpty;

public abstract class BaseService<E extends Entity> {
    protected final Logger logger = Logger.getLogger(getClass().getName());

    @Autowired
    ProjectService projectService;

    protected abstract CommonRepository<E> getRepository();

    public List<E> findAll(Session session, String projectId){
        throw new UnsupportedOperationException();
    }

    public List<E> findFiltered(Session session, String projectId, Filter filter){
        return getRepository().find(projectId, filter);
    }

    public E findOne(Session session, String projectId, String id){
        E entity = getRepository().findOne(projectId, id);
        if (entity == null){
            throw new EntityNotFoundException();
        }
        if (!userCanRead(session, projectId, entity)) {
            throw new EntityAccessDeniedException(
                    format("User %s can't read entity %s", session.getUser().getId(), id)
            );
        }
        return beforeReturn(session, entity);
    }

    public E save(Session user, String projectId, E entity){
        if (!userCanSave(user, projectId, entity)){
            throw new EntityAccessDeniedException(
                    format("User %s can't save entity %s", user.getUser().getId(), entity.getId())
            );
        }
        return isEmpty(entity.getId()) ?
                create(user, projectId, entity) : update(user, projectId, entity);
    }

    public Collection<E> save(Session user, String projectId, Collection<E> entities){
        if (!userCanSave(user, projectId, entities)){
            throw new EntityAccessDeniedException(
                    format("User %s can't save entities %s",
                            user.getUser().getId(),
                            entities.stream().map(obj -> obj == null ? "null" : obj.toString()).collect(joining(", ")))
            );
        }
        return getRepository().save(projectId, entities);
    }


    public void delete(Session session, String projectId, String id){
        beforeDelete(session, id);
        if (!userCanDelete(session, projectId, id)){
            throw new EntityAccessDeniedException(
                    format("User %s can't delete entity %s", session.getUser().getId(), id)
            );
        }
        getRepository().delete(projectId, id);
        afterDelete(session, id);
    }

    public long count(Session session, String projectId, Filter filter){

        return getRepository().count(projectId, filter);
    }


    protected boolean userCanRead(Session session, String projectId, E entity){
        return projectService.userCanRead(session, projectId);
    }
    protected boolean userCanSave(Session session, String projectId, E entity){
        return true;
    }
    protected boolean userCanSave(Session session, String projectId, Collection<E> entities) {
        return true;
    }
    protected boolean userCanDelete(Session session, String projectId, String id){
        return true;
    }
    protected boolean userCanCreate(Session session, String projectId, E entity){
        return true;
    }
    protected boolean userCanUpdate(Session session, String projectId, E entity){
        return true;
    }

    protected void beforeCreate(Session session, String projectId, E entity){
        if (!isEmpty(entity.getId()) && getRepository().exists(projectId, entity.getId())){
            throw new EntityValidationException(format("Entity with id [%s] already exists", entity.getId()));
        }
    }
    protected void afterCreate(Session session, E entity){}
    protected void beforeUpdate(Session session, E entity){}
    protected void afterUpdate(Session session, E entity){}
    protected void beforeSave(Session session, E entity){}
    protected void afterSave(Session session, E entity){}
    protected void beforeDelete(Session session, String id){}
    protected void afterDelete(Session session, String id){}
    protected E beforeReturn(Session session, E entity) {
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
        afterCreate(session, entity);
        return entity;
    }

    protected E update(Session session, String projectId, E entity){
        beforeUpdate(session, entity);
        if (!userCanUpdate(session, projectId, entity)){
            throw new EntityAccessDeniedException(getAccessDeniedMessage(session, entity, "UPDATE"));
        }
        entity = doSave(session, projectId, entity);
        afterUpdate(session, entity);
        return entity;
    }

    private E doSave(Session session, String projectId, E entity){
        beforeSave(session, entity);
        if (validateEntity(entity)){
            entity = getRepository().save(projectId, entity);
            afterSave(session, entity);
            return entity;
        } else throw new EntityValidationException(getAccessDeniedMessage(session, entity, "SAVE"));
    }

    protected String getAccessDeniedMessage(Session session, E ent, String action){
        String login = session != null && session.getUser() != null ? session.getUser().getId() : "unknown";
        String entId = ent != null && ent.getId() != null ? ent.getId().toString() : "new entity";
        return format("User %s doesn't have %s permissions on %s", login, action, entId);
    }

}
