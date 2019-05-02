package com.quack.dal.impl;

import com.quack.beans.User;
import com.quack.dal.UserRepositoryCustom;

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
