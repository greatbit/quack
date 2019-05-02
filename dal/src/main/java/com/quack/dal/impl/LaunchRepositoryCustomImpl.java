package com.quack.dal.impl;

import com.quack.beans.Launch;
import com.quack.dal.AttributeRepositoryCustom;

public class LaunchRepositoryCustomImpl extends CommonRepositoryImpl<Launch>
        implements AttributeRepositoryCustom {

    @Override
    public Class getEntityClass() {
        return Launch.class;
    }
}
