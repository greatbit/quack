package com.quack.dal.impl;

import com.quack.beans.ProjectGroup;
import com.quack.dal.ProjectGroupRepositoryCustom;

public class ProjectGroupRepositoryCustomImpl extends CommonRepositoryImpl<ProjectGroup>
        implements ProjectGroupRepositoryCustom {

    @Override
    public Class<ProjectGroup> getEntityClass() {
        return ProjectGroup.class;
    }

    @Override
    protected String getCollectionName(String projectId) {
        return "project-groups";
    }
}
