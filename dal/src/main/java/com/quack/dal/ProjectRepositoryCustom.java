package com.quack.dal;

import com.quack.beans.Project;

import java.util.List;

public interface ProjectRepositoryCustom {

    List<Project> findByOrganizationId(String id);
}
