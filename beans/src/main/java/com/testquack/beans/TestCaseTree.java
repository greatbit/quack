
package com.testquack.beans;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlType;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;



@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "TestCaseTree", propOrder = {
    "testCases",
    "children",
    "isLeaf",
    "title",
    "id",
    "count"
})
public class TestCaseTree extends TestCaseTreeBase {

    private final static long serialVersionUID = 1L;
    protected List<TestCase> testCases;
    protected List<TestCaseTree> children;

    /**
     * Default no-arg constructor
     * 
     */
    public TestCaseTree() {
        super();
    }

    /**
     * Fully-initialising value constructor
     * 
     */
    public TestCaseTree(final List<TestCase> testCases, final List<TestCaseTree> children) {
        this.testCases = testCases;
        this.children = children;
    }


    public List<TestCase> getTestCases() {
        if (testCases == null) {
            testCases = new ArrayList<TestCase>();
        }
        return this.testCases;
    }


    public List<TestCaseTree> getChildren() {
        if (children == null) {
            children = new ArrayList<TestCaseTree>();
        }
        return this.children;
    }


    public TestCaseTree withTestCases(TestCase... values) {
        if (values!= null) {
            for (TestCase value : values) {
                getTestCases().add(value);
            }
        }
        return this;
    }

    public TestCaseTree withTestCases(Collection values) {
        if (values!= null) {
            getTestCases().addAll(values);
        }
        return this;
    }

    public TestCaseTree withChildren(TestCaseTree... values) {
        if (values!= null) {
            for (TestCaseTree value: values) {
                getChildren().add(value);
            }
        }
        return this;
    }

    public TestCaseTree withChildren(Collection<TestCaseTree> values) {
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
    public void setTestCases(List<TestCase> testCases) {
        this.testCases = testCases;
    }

    /**
     * Sets the value of the children property.
     * 
     * @param children
     *     allowed object is
     *     {@link TestCaseTree }
     *     
     */
    public void setChildren(List<TestCaseTree> children) {
        this.children = children;
    }

}
