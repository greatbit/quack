package com.testquack.dal;

import com.testquack.beans.Project;

import java.util.List;

public interface ProjectRepositoryCustom {

    List<Project> findByOrganizationId(String id);
}
