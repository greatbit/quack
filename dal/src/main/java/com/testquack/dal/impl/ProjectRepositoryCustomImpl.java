package com.testquack.dal.impl;

import com.testquack.dal.ProjectRepositoryCustom;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import com.testquack.beans.Project;

import java.util.List;

public class ProjectRepositoryCustomImpl extends CommonRepositoryImpl<Project>
        implements ProjectRepositoryCustom {

    @Autowired
    MongoOperations mongoOperations;

    @Override
    public List<Project> findByOrganizationId(String id) {
        Query query = new Query().with(new Sort(Sort.Direction.ASC, "id"));
        query.addCriteria(Criteria.where("projectGroupId").in(id));
        return mongoOperations.find(query, Project.class);
    }

    @Override
    public Class getEntityClass() {
        return Project.class;
    }

    @Override
    protected String getCollectionName(String projectId) {
        return "projects";
    }
}
