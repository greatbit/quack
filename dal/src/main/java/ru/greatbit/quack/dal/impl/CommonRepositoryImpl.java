package ru.greatbit.quack.dal.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import ru.greatbit.quack.beans.Entity;
import ru.greatbit.quack.beans.Filter;
import ru.greatbit.quack.beans.Order;
import ru.greatbit.quack.dal.CommonRepository;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

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

    protected String getCollectionName(String projectId){
        return projectId + "_" + getEntityClass().getSimpleName();
    }

    protected Query getQuery(Filter filter){
        Criteria criteria = new Criteria();

        // Add AND fields criterias
        List<Criteria> fieldsCriteria = filter.getFields().entrySet().stream().
                map(field -> new Criteria(field.getKey()).in(field.getValue())).collect(Collectors.toList());
        if (!fieldsCriteria.isEmpty()){
            criteria.andOperator(fieldsCriteria.toArray(new Criteria[fieldsCriteria.size()]));
        }


        // Add NOT fields criterias
        List<Criteria> notFieldsCriteria = filter.getNotFields().entrySet().stream().
                map(field -> new Criteria(field.getKey()).in(field.getValue())).collect(Collectors.toList());
        if (!notFieldsCriteria.isEmpty()){
            criteria.norOperator(notFieldsCriteria.toArray(new Criteria[notFieldsCriteria.size()]));
        }

        // Add pageing
        Query query = Query.query(criteria).skip(filter.getSkip()).limit(filter.getLimit());

        // Add included and excluded fields
        if (!filter.getIncludedFields().isEmpty()){
            filter.getIncludedFields().forEach(field -> query.fields().include(field));
        }
        if (!filter.getExcludedFields().isEmpty()){
            filter.getExcludedFields().forEach(field -> query.fields().exclude(field));
        }

        // Add ordering
        if (!isEmpty(filter.getSortField())){
            Sort sort = filter.getOrder() != null && filter.getOrder().equals(Order.DESC) ?
                    new Sort(Sort.Direction.DESC, filter.getSortField()):
                    new Sort(Sort.Direction.ASC, filter.getSortField());
            query.with(sort);
        }

        return query;
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
