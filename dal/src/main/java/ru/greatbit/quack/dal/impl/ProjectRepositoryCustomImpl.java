package ru.greatbit.quack.dal.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import ru.greatbit.quack.beans.Project;
import ru.greatbit.quack.dal.ProjectRepositoryCustom;

import java.util.List;

public class ProjectRepositoryCustomImpl implements ProjectRepositoryCustom {

    @Autowired
    MongoOperations mongoOperations;

    @Override
    public List<Project> findByOrganizationId(String id) {
        Query query = new Query().with(new Sort(Sort.Direction.ASC, "id"));
        query.addCriteria(Criteria.where("projectGroupId").in(id));
        return mongoOperations.find(query, Project.class);
    }
}
