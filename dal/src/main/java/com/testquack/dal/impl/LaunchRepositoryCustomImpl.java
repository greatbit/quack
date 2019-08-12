package com.testquack.dal.impl;

import com.testquack.beans.Launch;
import com.testquack.dal.AttributeRepositoryCustom;

public class LaunchRepositoryCustomImpl extends CommonRepositoryImpl<Launch>
        implements AttributeRepositoryCustom {

    @Override
    public Class getEntityClass() {
        return Launch.class;
    }
}
