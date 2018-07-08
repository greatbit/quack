package ru.greatbit.quack.dal.impl;

import ru.greatbit.quack.beans.TestSuite;
import ru.greatbit.quack.dal.TestsuiteRepositoryCustom;

public class TestsuiteRepositoryCustomImpl extends CommonRepositoryImpl<TestSuite>
        implements TestsuiteRepositoryCustom {

    @Override
    public Class getEntityClass() {
        return TestSuite.class;
    }
}
