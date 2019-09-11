package com.testquack.services;

import com.testquack.beans.Launch;
import com.testquack.beans.LaunchStats;
import com.testquack.beans.LaunchStatus;
import com.testquack.beans.LaunchTestCase;
import com.testquack.beans.LaunchTestCaseTree;
import org.junit.Test;

import static junit.framework.TestCase.assertNotNull;
import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;


public class LaunchServiceTest extends BaseTest {

    @Test
    public void createLaunchByAliases() {
        LaunchTestCase launchTestCase1 = (LaunchTestCase) new LaunchTestCase().
                withLaunchStatus(LaunchStatus.FAILED).
                withFinishTime(1).
                withAlias(testCase1.getAlias());

        LaunchTestCase launchTestCase2 = (LaunchTestCase) new LaunchTestCase().
                withLaunchStatus(LaunchStatus.PASSED).
                withFinishTime(2).
                withAlias(testCase2.getAlias());

        LaunchTestCaseTree testCaseTree = new LaunchTestCaseTree().withTestCases(launchTestCase1, launchTestCase2);
        Launch launch = new Launch();
        launch.setTestCaseTree(testCaseTree);

        Launch persistedLaunch = launchService.create(adminSession, project1.getId(), launch);
        assertNotNull(persistedLaunch);

        LaunchTestCaseTree persistedTree = launch.getTestCaseTree();
        assertNotNull(persistedTree);
        assertThat(persistedTree.getTestCases().size(), is(2));
        assertThat(persistedTree.getChildren().size(), is(0));

        assertThat(
                persistedTree.getTestCases().stream().filter(testCase -> testCase.getId() == null).count(),
                is(0L)
        );

        LaunchTestCase launchTestCase = persistedTree.getTestCases().stream().
                filter(testCase -> testCase.getId().equals(testCase1.getId())).
                findFirst().orElse(null);
        assertNotNull(launchTestCase);
        assertThat(launchTestCase.getLaunchStatus(), is(LaunchStatus.FAILED));
        assertThat(launchTestCase.getName(), is(testCase1.getName()));

        launchTestCase = persistedTree.getTestCases().stream().
                filter(testCase -> testCase.getId().equals(testCase2.getId())).
                findFirst().orElse(null);
        assertNotNull(launchTestCase);
        assertThat(launchTestCase.getLaunchStatus(), is(LaunchStatus.PASSED));
        assertThat(launchTestCase.getName(), is(testCase2.getName()));

        LaunchStats launchStats = launch.getLaunchStats();
        assertThat(launchStats.getTotal(), is(2));
        assertThat(launchStats.getStatusCounters().get(LaunchStatus.FAILED), is(1));
        assertThat(launchStats.getStatusCounters().get(LaunchStatus.PASSED), is(1));
    }
}
