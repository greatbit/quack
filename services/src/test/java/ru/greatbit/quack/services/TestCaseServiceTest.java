package ru.greatbit.quack.services;


import org.junit.Test;
import ru.greatbit.quack.beans.Filter;
import ru.greatbit.quack.beans.Project;

import java.util.List;

import static java.util.stream.Collectors.toList;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;


public class TestCaseServiceTest extends BaseTest{

    @Test
    public void adminCanSeeAllTestCasesTest(){
        assertThat(testCaseService.findFiltered(adminSession, project1.getId(), new Filter()).size(), is(3));
        assertThat(testCaseService.findFiltered(adminSession, project2.getId(), new Filter()).size(), is(3));
        assertThat(testCaseService.findFiltered(adminSession, project3.getId(), new Filter()).size(), is(3));
    }

    @Test
    public void userCanSeeOnlyHisProjectsTestCasesTest(){
        assertThat(testCaseService.findFiltered(userSession, project1.getId(), new Filter()).size(), is(3));
        assertThat(testCaseService.findFiltered(userSession, project2.getId(), new Filter()).size(), is(3));
        assertThat(testCaseService.findFiltered(userSession, project3.getId(), new Filter()).size(), is(0));
    }


}