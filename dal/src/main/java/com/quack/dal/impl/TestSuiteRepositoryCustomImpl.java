package com.quack.dal.impl;

import com.quack.beans.TestSuite;
import com.quack.dal.TestSuiteRepositoryCustom;

public class TestSuiteRepositoryCustomImpl extends CommonRepositoryImpl<TestSuite>
        implements TestSuiteRepositoryCustom {

    @Override
    public Class getEntityClass() {
        return TestSuite.class;
    }
}
