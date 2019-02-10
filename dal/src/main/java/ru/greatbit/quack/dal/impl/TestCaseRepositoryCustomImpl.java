package ru.greatbit.quack.dal.impl;

import ru.greatbit.quack.beans.TestCase;
import ru.greatbit.quack.dal.TestCaseRepositoryCustom;

public class TestCaseRepositoryCustomImpl extends CommonRepositoryImpl<TestCase>
        implements TestCaseRepositoryCustom {

    @Override
    public Class getEntityClass() {
        return TestCase.class;
    }
}
