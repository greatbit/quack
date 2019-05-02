package com.quack.dal.impl;

import com.quack.beans.Attribute;
import com.quack.beans.TestCase;
import com.quack.dal.AttributeRepositoryCustom;

public class AttributeRepositoryCustomImpl extends CommonRepositoryImpl<TestCase>
        implements AttributeRepositoryCustom {

    @Override
    public Class getEntityClass() {
        return Attribute.class;
    }
}
