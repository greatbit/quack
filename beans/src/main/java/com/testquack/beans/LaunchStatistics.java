package com.testquack.beans;

import javax.xml.bind.annotation.XmlElement;
import java.util.HashMap;
import java.util.Map;

public class LaunchStatistics extends LaunchStatisticsBase {
    @XmlElement(required = true)
    private Map<String, Integer> users;

    @XmlElement(required = true)
    protected LaunchStats launchStats = new LaunchStats();

    public Map<String, Integer> getUsers() {
        if (users == null) {
            users = new HashMap<>();
        }
        return users;
    }

    public LaunchStats getLaunchStats() {
        return launchStats;
    }

    public void setUsers(Map<String, Integer> users) {
        this.users = users;
    }
}
