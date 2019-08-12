package com.testquack.beans;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "Launch")
public class Launch extends LaunchBase {

    @XmlElement(required = true)
    protected LaunchTestCaseTree testCaseTree;

    @XmlElement(required = true)
    protected LaunchStats launchStats = new LaunchStats();

    /**
     * Gets the value of the testCaseTree property.
     *
     * @return
     *     possible object is
     *     {@link TestCaseTreeBase }
     *
     */
    public LaunchTestCaseTree getTestCaseTree() {
        return testCaseTree;
    }

    /**
     * Sets the value of the testCaseTree property.
     *
     * @param value
     *     allowed object is
     *     {@link TestCaseTreeBase }
     *
     */
    public void setTestCaseTree(LaunchTestCaseTree value) {
        this.testCaseTree = value;
    }

    public LaunchStats getLaunchStats() {
        return launchStats;
    }

    public void setLaunchStats(LaunchStats launchStats) {
        this.launchStats = launchStats;
    }
}
