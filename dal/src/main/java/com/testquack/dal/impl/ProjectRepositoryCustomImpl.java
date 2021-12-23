package com.testquack.dal.impl;

import com.testquack.dal.ProjectRepositoryCustom;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import com.testquack.beans.Project;

import java.util.List;

import static org.apache.commons.lang3.StringUtils.isEmpty;

public class ProjectRepositoryCustomImpl extends CommonRepositoryImpl<Project>
        implements ProjectRepositoryCustom {

    @Autowired
    MongoOperations mongoOperations;

    @Override
    public List<Project> findByOrganizationId(String id) {
        Query query = new Query().with(Sort.by(Sort.Direction.ASC, "id"));
        query.addCriteria(Criteria.where("organizationId").in(id));
        return mongoOperations.find(query, Project.class);
    }

    @Override
    public Class getEntityClass() {
        return Project.class;
    }

    @Override
    protected String getCollectionName(String organizationId, String projectId) {
        return isEmpty(organizationId) ? "projects" : organizationId + "_" + "projects";
    }
}
