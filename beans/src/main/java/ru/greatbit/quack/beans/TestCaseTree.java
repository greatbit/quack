
package ru.greatbit.quack.beans;

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
public class TestCaseTree<T extends TestCase> extends TestCaseTreeBase {

    private final static long serialVersionUID = 1L;
    protected List<T> testCases;
    protected List<TestCaseTree<T>> children;

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
    public TestCaseTree(final List<T> testCases, final List<TestCaseTree<T>> children) {
        this.testCases = testCases;
        this.children = children;
    }


    public List<T> getTestCases() {
        if (testCases == null) {
            testCases = new ArrayList<T>();
        }
        return this.testCases;
    }


    public List<TestCaseTree<T>> getChildren() {
        if (children == null) {
            children = new ArrayList<TestCaseTree<T>>();
        }
        return this.children;
    }


    public TestCaseTree<T> withTestCases(T... values) {
        if (values!= null) {
            for (T value: values) {
                getTestCases().add(value);
            }
        }
        return this;
    }

    public TestCaseTree<T> withTestCases(Collection<T> values) {
        if (values!= null) {
            getTestCases().addAll(values);
        }
        return this;
    }

    public TestCaseTree<T> withChildren(TestCaseTree<T>... values) {
        if (values!= null) {
            for (TestCaseTree<T> value: values) {
                getChildren().add(value);
            }
        }
        return this;
    }

    public TestCaseTree<T> withChildren(Collection<TestCaseTree<T>> values) {
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
    public void setTestCases(List<T> testCases) {
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
    public void setChildren(List<TestCaseTree<T>> children) {
        this.children = children;
    }

}
