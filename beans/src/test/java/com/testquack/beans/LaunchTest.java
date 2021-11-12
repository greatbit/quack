package com.testquack.beans;

import org.junit.Test;

import static java.util.stream.Collectors.toSet;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.is;



public class LaunchTest {

    @Test
    public void TestcaseTreeToLaunchTree(){
        TestCaseTree testCaseTree = new TestCaseTree();

        TestCaseTree tcChild1 = (TestCaseTree) new TestCaseTree().withId("1");
        TestCaseTree tcChild2 = (TestCaseTree) new TestCaseTree().withId("2");
        TestCaseTree tcChild1_1 = (TestCaseTree) new TestCaseTree().withId("1_1");

        TestCase tcl1i1 = (TestCase) new TestCase().withId("l1i1");
        TestCase tcl1i2 = (TestCase) new TestCase().withId("l1i2");
        tcChild1.getTestCases().add(tcl1i1);
        tcChild1.getTestCases().add(tcl1i2);

        TestCase tcl2i1 = (TestCase) new TestCase().withId("l2i1");
        TestCase tcl2i2 = (TestCase) new TestCase().withId("l2i2");
        tcChild2.getTestCases().add(tcl2i1);
        tcChild2.getTestCases().add(tcl2i2);

        TestCase tcl1_1i1 = (TestCase) new TestCase().withId("l1_1i1");
        TestCase tcl1_1i2 = (TestCase) new TestCase().withId("l1_1i2");
        tcChild1_1.getTestCases().add(tcl1_1i1);
        tcChild1_1.getTestCases().add(tcl1_1i2);

        testCaseTree.withChildren(tcChild1, tcChild2);
        tcChild1.withChildren(tcChild1_1);

        LaunchTestCaseTree launchTestCaseTree = new LaunchTestCaseTree(testCaseTree);
        assertThat(launchTestCaseTree.getChildren().size(), is(2));
        assertThat(launchTestCaseTree.getChildren().stream().
                map(LaunchTestCaseTree::getId).collect(toSet()),
                containsInAnyOrder("1", "2"));

        LaunchTestCaseTree subTree = launchTestCaseTree.getChildren().stream().
                filter(child -> child.getId().equals("1")).findFirst().
                orElseThrow(RuntimeException::new);
        assertThat(subTree.getChildren().size(), is(1));
        LaunchTestCaseTree leaf = subTree.getChildren().get(0);
        assertThat(leaf.getTestCases().stream().
                map(LaunchTestCase::getId).collect(toSet()),
                containsInAnyOrder("l1_1i1", "l1_1i2"));
        assertThat(leaf.getTestCases().stream().
                        map(LaunchTestCase::getLaunchStatus).collect(toSet()),
                contains(LaunchStatus.RUNNABLE));
        assertThat(leaf.getTestCases().stream().
                map(LaunchTestCase::getUuid).
                        filter(uuid -> uuid != null).
                        filter(uuid -> !"".equals(uuid)).count(), is(2l));

    }

}
