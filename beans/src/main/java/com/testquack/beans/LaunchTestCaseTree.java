
package com.testquack.beans;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlType;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;


@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "TestCaseTree", propOrder = {
    "testCases",
    "children",
    "isLeaf",
    "title",
    "id",
    "count"
})
public class LaunchTestCaseTree extends TestCaseTreeBase {

    private final static long serialVersionUID = 1L;
    protected List<LaunchTestCase> testCases;
    protected List<LaunchTestCaseTree> children;

    /**
     * Default no-arg constructor
     *
     */
    public LaunchTestCaseTree() {
        super();
    }

    /**
     * Fully-initialising value constructor
     *
     */
    public LaunchTestCaseTree(final List<LaunchTestCase> testCases, final List<LaunchTestCaseTree> children) {
        this.testCases = testCases;
        this.children = children;
    }

    public LaunchTestCaseTree(TestCaseTree testCaseTree){
        this.withTitle(testCaseTree.getTitle()).
                withCount(testCaseTree.getCount()).
                withId(testCaseTree.getId()).
                withIsLeaf(testCaseTree.isLeaf);
        this.withTestCases(
                testCaseTree.getTestCases().stream().map(testCase ->{
                    LaunchTestCase launchTestCase = new LaunchTestCase().
                            withLaunchStatus(LaunchStatus.RUNNABLE).
                            withUuid(UUID.randomUUID().toString());
                    testCase.copyTo(launchTestCase);
                    return launchTestCase;
                }).collect(Collectors.toList()));
        this.withChildren(
                testCaseTree.getChildren().stream().map(child -> new LaunchTestCaseTree(child)).
                        collect(Collectors.toList())
        );
    }

    public List<LaunchTestCase> getTestCases() {
        if (testCases == null) {
            testCases = new ArrayList<LaunchTestCase>();
        }
        return this.testCases;
    }


    public List<LaunchTestCaseTree> getChildren() {
        if (children == null) {
            children = new ArrayList<LaunchTestCaseTree>();
        }
        return this.children;
    }


    public LaunchTestCaseTree withTestCases(LaunchTestCase... values) {
        if (values!= null) {
            for (LaunchTestCase value: values) {
                getTestCases().add(value);
            }
        }
        return this;
    }

    public LaunchTestCaseTree withTestCases(Collection<LaunchTestCase> values) {
        if (values!= null) {
            getTestCases().addAll(values);
        }
        return this;
    }

    public LaunchTestCaseTree withChildren(LaunchTestCaseTree... values) {
        if (values!= null) {
            for (LaunchTestCaseTree value: values) {
                getChildren().add(value);
            }
        }
        return this;
    }

    public LaunchTestCaseTree withChildren(Collection<LaunchTestCaseTree> values) {
        if (values!= null) {
            getChildren().addAll(values);
        }
        return this;
    }


    /**
     * Sets the value of the testCases property.
     *
     * @param testCases
     *     allowed object is
     *     {@link TestCase }
     *
     */
    public void setTestCases(List<LaunchTestCase> testCases) {
        this.testCases = testCases;
    }

    /**
     * Sets the value of the children property.
     *
     * @param children
     *     allowed object is
     *     {@link LaunchTestCaseTree }
     *
     */
    public void setChildren(List<LaunchTestCaseTree> children) {
        this.children = children;
    }

}
