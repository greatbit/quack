package com.testquack.launcher;

import java.util.LinkedList;
import java.util.List;

public class Executables {

    private String launchId;

    private String projectId;

    private List<Executable> executables = new LinkedList<>();

    public Executables() { }

    public Executables(String launchId, String projectId, List<Executable> executables) {
        this.launchId = launchId;
        this.projectId = projectId;
        this.executables = executables;
    }

    public List<Executable> getExecutables() {
        return executables;
    }

    public void setExecutables(List<Executable> executables) {
        this.executables = executables;
    }

    public String getLaunchId() {
        return launchId;
    }

    public void setLaunchId(String launchId) {
        this.launchId = launchId;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }
}
