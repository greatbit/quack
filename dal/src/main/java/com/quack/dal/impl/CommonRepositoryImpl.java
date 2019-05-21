package com.quack.dal.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import com.quack.beans.Entity;
import com.quack.beans.Filter;
import com.quack.beans.Order;
import com.quack.dal.CommonRepository;

import java.util.*;
import java.util.stream.Collectors;

import static com.quack.dal.impl.DBUtils.getQuery;
import static org.apache.commons.lang3.StringUtils.isEmpty;

public abstract class CommonRepositoryImpl<E extends Entity> implements CommonRepository<E> {

    @Autowired
    MongoOperations mongoOperations;

    public abstract Class<E> getEntityClass();

    @Override
    public List<E> find(String projectId, Filter filter) {
        return mongoOperations.find(getQuery(filter),
                getEntityClass(),
                getCollectionName(projectId));

    }

    @Override
    public long count(String projectId, Filter filter) {
        return mongoOperations.count(getQuery(filter),
                getEntityClass(),
                getCollectionName(projectId));

    }

    @Override
    public E save(String projectId, E entity) {
        mongoOperations.save(entity, getCollectionName(projectId));
        return entity;
    }

    @Override
    public void delete(String projectId, String entityId) {
        E entity = findOne(projectId, entityId);
        entity.setDeleted(true);
        mongoOperations.save(entity, getCollectionName(projectId));
    }

    public static String getCollectionName(String projectId, Class clazz) {
        return projectId + "_" + clazz.getSimpleName();
    }

    protected String getCollectionName(String projectId){
        return getCollectionName(projectId, getEntityClass());
    }

    @Override
    public E findOne(String projectId, String id) {
        return mongoOperations.findOne(new Query(Criteria.where("id").is(id)), getEntityClass(), getCollectionName(projectId));
    }

    @Override
    public Collection<E> save(String projectId, Collection<E> entities) {
        entities.forEach(element -> mongoOperations.save(element, getCollectionName(projectId)));
        return entities;
    }

    @Override
    public boolean exists(String projectId, String id) {
        return mongoOperations.exists(new Query(Criteria.where("id").is(id)), getEntityClass(), getCollectionName(projectId));
    }
}
