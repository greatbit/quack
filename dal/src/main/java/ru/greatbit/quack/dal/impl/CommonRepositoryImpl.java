package ru.greatbit.quack.dal.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import ru.greatbit.quack.beans.Filter;
import ru.greatbit.quack.beans.Order;
import ru.greatbit.quack.dal.CommonRepository;

import java.util.List;
import java.util.stream.Collectors;

import static org.apache.commons.lang3.StringUtils.isEmpty;

public abstract class CommonRepositoryImpl<E> implements CommonRepository<E> {

    @Autowired
    MongoOperations mongoOperations;

    public abstract Class<E> getEntityClass();

    @Override
    public List<E> find(String projectId, Filter filter, int skip, int limit) {
        return mongoOperations.find(getQuery(filter, skip, limit),
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
        mongoOperations.remove(entityId, getCollectionName(projectId));
    }

    protected String getCollectionName(String projectId){
        return projectId + "_" + getEntityClass().getSimpleName();
    }

    private Query getQuery(Filter filter, int skip, int limit){
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
        Query query = Query.query(criteria).skip(skip).limit(limit);

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
}
