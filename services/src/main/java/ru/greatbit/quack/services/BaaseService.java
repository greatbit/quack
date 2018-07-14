package ru.greatbit.quack.services;

import ru.greatbit.quack.beans.Entity;
import ru.greatbit.quack.beans.Filter;
import ru.greatbit.quack.beans.Role;
import ru.greatbit.quack.beans.Session;
import ru.greatbit.quack.dal.CommonRepository;
import ru.greatbit.quack.services.errors.EntityAccessDeniedException;
import ru.greatbit.quack.services.errors.EntityNotFoundException;
import ru.greatbit.quack.services.errors.EntityValidationException;

import java.util.Collection;

import static java.lang.String.format;
import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;
import static org.apache.commons.lang3.StringUtils.isEmpty;

public abstract class BaaseService<E extends Entity> {

    protected abstract CommonRepository<E> getRepository();

    public Collection<E> findAll(Session session){
        throw new UnsupportedOperationException();
    }

    public Collection<E> findFiltered(Session session, String projectId, Filter filter){
        return getRepository().find(projectId, filter).stream().
                map(entity -> beforeReturn(session, projectId, entity)).collect(toList());
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
        return beforeReturn(session, projectId, entity);
    }



    public E save(Session user, String projectId, E entity){
        if (!userCanSave(user, projectId, entity)){
            throw new EntityAccessDeniedException(
                    format("User %s can't save entity %s for project %s", user.getUser().getId(), entity.getId(), projectId)
            );
        }
        return  isEmpty(entity.getId()) ?
                create(user, projectId, entity) : update(user, projectId, entity) ;
    }

    public Collection<E> save(Session user, String projectId, Collection<E> entities){
        if (!userCanSave(user, projectId, entities)){
            throw new EntityAccessDeniedException(
                    format("User %s can't save entities %s for project %s",
                            user.getUser().getId(),
                            entities.stream().map(obj -> obj == null ? "null" : obj.toString()).collect(joining(", ")),
                            projectId
                    )
            );
        }
        return getRepository().save(projectId, entities);
    }


    public void delete(Session session, String projectId, String id){
        beforeDelete(session, projectId, id);
        if (!userCanDelete(session, projectId, id)){
            throw new EntityAccessDeniedException(
                    format("User %s can't delete entity %s for project %s", session.getUser().getId(), id, projectId)
            );
        }
        getRepository().delete(projectId, id);
        afterDelete(session, projectId, id);
    }

    public long count(Session session, String projectId, Filter filter){
        return getRepository().count(projectId, filter);
    }


    protected abstract boolean userCanRead(Session user, String projectId, E entity);
    protected boolean userCanSave(Session user, String projectId, E entity){
        return true;
    }
    protected boolean userCanSave(Session user, String projectId, Collection<E> entities) {
        return true;
    }
    protected boolean userCanDelete(Session user, String projectId, String id){
        return userHasSystemRole(user, Role.ADMIN);
    }
    protected boolean userCanCreate(Session user, String projectId, E entity){
        return true;
    }
    protected boolean userCanUpdate(Session user, String projectId, E entity){
        return userHasSystemRole(user, Role.ADMIN);
    }

    protected void beforeCreate(Session session, String projectId, E entity){
        if (!isEmpty(entity.getId()) && getRepository().exists(projectId, entity.getId())){
            throw new EntityValidationException(format("Entity with id [%s] already exists", entity.getId()));
        }
    }
    protected void afterCreate(Session session, String projectId, E entity){}
    protected void beforeUpdate(Session session, String projectId, E entity){}
    protected void afterUpdate(Session session, String projectId, E entity){}
    protected void beforeSave(Session session, String projectId, E entity){}
    protected void afterSave(Session session, String projectId, E entity){}
    protected void beforeDelete(Session session, String projectId, String id){}
    protected void afterDelete(Session session, String projectId, String id){}
    protected E beforeReturn(Session session, String projectId, E entity) {
        return entity;
    }


    protected boolean validateEntity(E ent){
        return true;
    }

    protected E create(Session session, String projectId, E entity){
        beforeCreate(session, projectId, entity);
        if (!userCanCreate(session, projectId, entity)){
            throw new EntityAccessDeniedException(getAccessDeniedMessage(session, projectId, entity, "CREATE"));
        }
        entity = doSave(session, projectId, entity);
        afterCreate(session, projectId, entity);
        return entity;
    }

    protected E update(Session session, String projectId, E entity){
        beforeUpdate(session, projectId, entity);
        if (!userCanUpdate(session, projectId, entity)){
            throw new EntityAccessDeniedException(getAccessDeniedMessage(session, projectId, entity, "UPDATE"));
        }
        entity = doSave(session, projectId, entity);
        afterUpdate(session, projectId, entity);
        return entity;
    }

    protected boolean userHasSystemRole(Session user, Role role){
        return user != null && user.getRoles().contains(role);
    }

    private E doSave(Session session, String projectId, E entity){
        beforeSave(session, projectId, entity);
        if (validateEntity(entity)){
            entity = getRepository().save(projectId, entity);
            afterSave(session, projectId, entity);
            return entity;
        } else throw new EntityValidationException(getAccessDeniedMessage(session, projectId, entity, "SAVE"));
    }

    protected String getAccessDeniedMessage(Session session, String projectId, E ent, String action){
        String login = session != null && session.getUser() != null ? session.getUser().getId() : "unknown";
        String entId = ent != null && ent.getId() != null ? ent.getId().toString() : "new entity";
        return format("User %s doesn't have %s permissions on %s", login, action, entId);
    }
}
