package com.testquack.dal.impl;

import com.testquack.beans.TestCase;
import com.testquack.dal.TestCaseRepositoryCustom;

public class TestCaseRepositoryCustomImpl extends CommonRepositoryImpl<TestCase>
        implements TestCaseRepositoryCustom {

    @Override
    public Class getEntityClass() {
        return TestCase.class;
    }
}
