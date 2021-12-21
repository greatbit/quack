package com.testquack.dal.impl;

import com.testquack.beans.EntityPreview;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import com.testquack.beans.Entity;
import com.testquack.beans.Filter;
import com.testquack.beans.Order;
import com.testquack.dal.CommonRepository;
import org.springframework.data.mongodb.core.query.Update;

import java.util.*;

import static org.apache.commons.lang3.StringUtils.isEmpty;

public abstract class CommonRepositoryImpl<E extends EntityPreview> implements CommonRepository<E> {

    @Autowired
    MongoOperations mongoOperations;

    public abstract Class<E> getEntityClass();

    @Override
    public List<E> find(String organizationId, String projectId, Filter filter) {
        return mongoOperations.find(DBUtils.getQuery(getEntityClass(), filter),
                getEntityClass(),
                getCollectionName(organizationId, projectId));

    }

    @Override
    public long count(String organizationId, String projectId, Filter filter) {
        return mongoOperations.count(DBUtils.getQuery(getEntityClass(), filter),
                getEntityClass(),
                getCollectionName(organizationId, projectId));

    }

    @Override
    public E save(String organizationId, String projectId, E entity) {
        mongoOperations.save(entity, getCollectionName(organizationId, projectId));
        return entity;
    }

    @Override
    public void delete(String organizationId, String projectId, String entityId) {
        E entity = findOne(organizationId, projectId, entityId);
        entity.setDeleted(true);
        mongoOperations.save(entity, getCollectionName(organizationId, projectId));
    }

    public static String getCollectionName(String organizationId, String projectId, Class clazz) {
        return isEmpty(organizationId) ?
                projectId + "_" + clazz.getSimpleName() :
                organizationId + "_" + projectId + "_" + clazz.getSimpleName();
    }

    protected String getCollectionName(String organizationId, String projectId){
        return getCollectionName(organizationId, projectId, getEntityClass());
    }

    @Override
    public E findOne(String organizationId, String projectId, String id) {
        return mongoOperations.findOne(new Query(Criteria.where("id").is(id)), getEntityClass(), getCollectionName(organizationId, projectId));
    }

    @Override
    public Collection<E> save(String organizationId, String projectId, Collection<E> entities) {
        entities.forEach(element -> mongoOperations.save(element, getCollectionName(organizationId, projectId)));
        return entities;
    }

    @Override
    public boolean exists(String organizationId, String projectId, String id) {
        return mongoOperations.exists(new Query(Criteria.where("id").is(id)), getEntityClass(), getCollectionName(organizationId, projectId));
    }

    @Override
    public void delete(String organizationId, String projectId, Filter filter) {
        Query query = DBUtils.getQuery(getEntityClass(), filter);
        Update update = new Update().set("deleted", true);
        mongoOperations.updateMulti(query, update, getCollectionName(organizationId, projectId));
    }
}
