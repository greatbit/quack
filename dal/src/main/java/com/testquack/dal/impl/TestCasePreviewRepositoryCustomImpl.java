package com.testquack.dal.impl;

import com.testquack.beans.TestCase;
import com.testquack.beans.TestCasePreview;
import com.testquack.dal.TestCasePreviewRepositoryCustom;

public class TestCasePreviewRepositoryCustomImpl extends CommonRepositoryImpl<TestCasePreview>
        implements TestCasePreviewRepositoryCustom {

    @Override
    public Class getEntityClass() {
        return TestCasePreview.class;
    }

    @Override
    protected String getCollectionName(String organizationId, String projectId) {
        return getCollectionName(organizationId, projectId, TestCase.class);
    }
}
