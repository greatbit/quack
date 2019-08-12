package com.testquack.dal.impl;

import com.testquack.beans.TestSuite;
import com.testquack.dal.TestSuiteRepositoryCustom;

public class TestSuiteRepositoryCustomImpl extends CommonRepositoryImpl<TestSuite>
        implements TestSuiteRepositoryCustom {

    @Override
    public Class getEntityClass() {
        return TestSuite.class;
    }
}
