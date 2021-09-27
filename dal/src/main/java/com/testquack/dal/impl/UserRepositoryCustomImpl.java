package com.testquack.dal.impl;

import com.testquack.beans.User;
import com.testquack.dal.UserRepositoryCustom;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import java.util.List;

import static org.apache.commons.lang3.StringUtils.isEmpty;

public class UserRepositoryCustomImpl extends CommonRepositoryImpl<User>
        implements UserRepositoryCustom {

    @Override
    public Class getEntityClass() {
        return User.class;
    }

    @Override
    protected String getCollectionName(String organizationId, String projectId) {
        return isEmpty(organizationId) ? "users" : organizationId + "_users";
    }

    @Override
    public List<User> suggestUsers(String organizationId, String literal) {
        Criteria criteria = new Criteria();
        criteria.orOperator(
                Criteria.where("login").regex(literal, "i"),
                Criteria.where("firstName").regex(literal, "i"),
                Criteria.where("lastName").regex(literal, "i"),
                Criteria.where("middleName").regex(literal, "i")
        );
        Query query = new Query(criteria);
        query.limit(20);
        return mongoOperations.find(query, User.class, getCollectionName(organizationId, null));
    }
}
