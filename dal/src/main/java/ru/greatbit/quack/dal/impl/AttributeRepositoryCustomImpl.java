package ru.greatbit.quack.dal.impl;

import ru.greatbit.quack.beans.Attribute;
import ru.greatbit.quack.beans.TestCase;
import ru.greatbit.quack.dal.AttributeRepositoryCustom;

public class AttributeRepositoryCustomImpl extends CommonRepositoryImpl<TestCase>
        implements AttributeRepositoryCustom {

    @Override
    public Class getEntityClass() {
        return Attribute.class;
    }
}
