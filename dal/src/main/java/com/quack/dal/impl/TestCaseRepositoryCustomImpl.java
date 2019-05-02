package com.quack.dal.impl;

import com.quack.beans.TestCase;
import com.quack.dal.TestCaseRepositoryCustom;

public class TestCaseRepositoryCustomImpl extends CommonRepositoryImpl<TestCase>
        implements TestCaseRepositoryCustom {

    @Override
    public Class getEntityClass() {
        return TestCase.class;
    }
}
