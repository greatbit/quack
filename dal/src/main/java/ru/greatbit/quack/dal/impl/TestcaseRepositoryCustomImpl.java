package ru.greatbit.quack.dal.impl;

import ru.greatbit.quack.beans.TestCase;
import ru.greatbit.quack.dal.TestcaseRepositoryCustom;

public class TestcaseRepositoryCustomImpl extends CommonRepositoryImpl<TestCase>
        implements TestcaseRepositoryCustom {

    @Override
    public Class getEntityClass() {
        return TestCase.class;
    }
}
