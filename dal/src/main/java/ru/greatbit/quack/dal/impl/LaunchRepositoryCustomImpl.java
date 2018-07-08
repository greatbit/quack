package ru.greatbit.quack.dal.impl;

import ru.greatbit.quack.beans.Launch;
import ru.greatbit.quack.dal.AttributeRepositoryCustom;

public class LaunchRepositoryCustomImpl extends CommonRepositoryImpl<Launch>
        implements AttributeRepositoryCustom {

    @Override
    public Class getEntityClass() {
        return Launch.class;
    }
}
