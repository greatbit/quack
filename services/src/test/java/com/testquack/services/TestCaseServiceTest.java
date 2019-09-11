package com.testquack.services;


import com.testquack.beans.Filter;
import com.testquack.services.errors.EntityAccessDeniedException;
import junit.framework.TestCase;
import org.junit.Test;

import static junit.framework.TestCase.assertNull;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertThat;


public class TestCaseServiceTest extends BaseTest{

    @Test
    public void adminCanSeeAllTestCasesTest(){
        assertThat(testCaseService.findFiltered(adminSession, project1.getId(), new Filter()).size(), is(7));
        assertThat(testCaseService.findFiltered(adminSession, project2.getId(), new Filter()).size(), is(3));
        assertThat(testCaseService.findFiltered(adminSession, project3.getId(), new Filter()).size(), is(3));
    }

    @Test
    public void adminCanAccessAllTestCasesTest(){
        assertNotNull(testCaseService.findOne(adminSession, project1.getId(), testCasesProject1.get(0).getId()));
        assertNotNull(testCaseService.findOne(adminSession, project2.getId(), testCasesProject2.get(0).getId()));
        assertNotNull(testCaseService.findOne(adminSession, project3.getId(), testCasesProject3.get(0).getId()));
    }

    @Test
    public void userCanSeeOnlyHisProjectsTestCasesTest(){
        assertThat(testCaseService.findFiltered(userSession, project1.getId(), new Filter()).size(), is(7));
        assertThat(testCaseService.findFiltered(userSession, project2.getId(), new Filter()).size(), is(3));
        assertThat(testCaseService.findFiltered(userSession, project3.getId(), new Filter()).size(), is(0));
    }

    @Test
    public void userCanAccessHisProjectsTestCasesTest(){
        assertNotNull(testCaseService.findOne(userSession, project1.getId(), testCasesProject1.get(0).getId()));
        assertNotNull(testCaseService.findOne(userSession, project2.getId(), testCasesProject2.get(0).getId()));
    }

    @Test(expected = EntityAccessDeniedException.class)
    public void userCanNotAccessRestrictedProjectsTestCasesTest(){
        TestCase.assertNull(testCaseService.findOne(userSession, project3.getId(), testCasesProject3.get(0).getId()));
    }


}