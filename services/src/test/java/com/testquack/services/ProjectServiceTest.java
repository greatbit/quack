package com.testquack.services;


import com.testquack.beans.Filter;
import com.testquack.beans.Project;
import org.hamcrest.Matchers;
import org.junit.Test;

import java.util.List;

import static java.util.stream.Collectors.toList;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;


public class ProjectServiceTest extends BaseTest{

    @Test
    public void adminCanSeeAllProjectsTest(){
        List<Project> projects = projectService.findFiltered(
                adminSession, null, new Filter());
        assertThat(projects.size(), is(4));
        assertThat(
                projects.stream().map(Project::getId).collect(toList()),
                containsInAnyOrder(
                        super.projects.stream().map(Project::getId).toArray()
                )
        );
    }

    @Test
    public void userCanSeeOnlyHisProjectsTest(){
        List<Project> projects = projectService.findFiltered(
                userSession, null, new Filter());
        assertThat(projects.size(), is(3));
        assertThat(
                projects.stream().map(Project::getId).collect(toList()),
                Matchers.containsInAnyOrder(project1.getId(), project2.getId(), project4.getId())
        );
    }


}