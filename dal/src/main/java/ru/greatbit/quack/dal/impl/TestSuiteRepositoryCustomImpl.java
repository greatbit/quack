package ru.greatbit.quack.dal.impl;

import ru.greatbit.quack.beans.TestSuite;
import ru.greatbit.quack.dal.TestSuiteRepositoryCustom;

public class TestSuiteRepositoryCustomImpl extends CommonRepositoryImpl<TestSuite>
        implements TestSuiteRepositoryCustom {

    @Override
    public Class getEntityClass() {
        return TestSuite.class;
    }
}
