package com.testquack.dal.impl;

import com.testquack.beans.Organization;
import com.testquack.dal.OrganizationRepositoryCustom;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;


public class OrganizationRepositoryCustomImpl extends CommonRepositoryImpl<Organization>
        implements OrganizationRepositoryCustom {

    @Autowired
    MongoOperations mongoOperations;

    @Override
    public Class getEntityClass() {
        return Organization.class;
    }

    @Override
    protected String getCollectionName(String organizationId, String projectId) {
        return "organizations";
    }
}
