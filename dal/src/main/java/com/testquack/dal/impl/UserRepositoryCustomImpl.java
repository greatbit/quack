package com.testquack.dal.impl;

import com.testquack.beans.User;
import com.testquack.dal.UserRepositoryCustom;

public class UserRepositoryCustomImpl extends CommonRepositoryImpl<User>
        implements UserRepositoryCustom {

    @Override
    public Class getEntityClass() {
        return User.class;
    }

    @Override
    protected String getCollectionName(String projectId) {
        return super.getCollectionName("users");
    }
}
