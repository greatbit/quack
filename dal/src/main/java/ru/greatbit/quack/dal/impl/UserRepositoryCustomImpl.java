package ru.greatbit.quack.dal.impl;

import ru.greatbit.quack.beans.User;
import ru.greatbit.quack.dal.UserRepositoryCustom;

public class UserRepositoryCustomImpl extends CommonRepositoryImpl<User>
        implements UserRepositoryCustom {

    @Override
    public Class getEntityClass() {
        return User.class;
    }
}
