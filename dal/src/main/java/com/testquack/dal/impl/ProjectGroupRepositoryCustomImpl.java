package com.testquack.dal.impl;

import com.testquack.beans.ProjectGroup;
import com.testquack.dal.ProjectGroupRepositoryCustom;

public class ProjectGroupRepositoryCustomImpl extends CommonRepositoryImpl<ProjectGroup>
        implements ProjectGroupRepositoryCustom {

    @Override
    public Class<ProjectGroup> getEntityClass() {
        return ProjectGroup.class;
    }

    @Override
    protected String getCollectionName(String organizationId, String projectId) {
        return "project-groups";
    }
}
