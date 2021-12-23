package com.testquack.beans;

import javax.xml.bind.annotation.XmlElement;
import java.util.HashMap;
import java.util.Map;

public class LaunchStats {

    protected int total;

    @XmlElement(required = true)
    private Map<LaunchStatus, Integer> statusCounters;

    public LaunchStats() {
        statusCounters = new HashMap<>();
        statusCounters.put(LaunchStatus.PASSED, 0);
        statusCounters.put(LaunchStatus.FAILED, 0);
        statusCounters.put(LaunchStatus.BROKEN, 0);
        statusCounters.put(LaunchStatus.SKIPPED, 0);
        statusCounters.put(LaunchStatus.RUNNABLE, 0);
        statusCounters.put(LaunchStatus.RUNNING, 0);
    }

    public Map<LaunchStatus, Integer> getStatusCounters() {
        return statusCounters;
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public void setStatusCounters(Map<LaunchStatus, Integer> statusCounters) {
        this.statusCounters = statusCounters;
    }
}
