package com.testquack.dal.impl;

import com.testquack.beans.Attribute;
import com.testquack.beans.TestCase;
import com.testquack.dal.AttributeRepositoryCustom;

public class AttributeRepositoryCustomImpl extends CommonRepositoryImpl<TestCase>
        implements AttributeRepositoryCustom {

    @Override
    public Class getEntityClass() {
        return Attribute.class;
    }
}
