package com.testquack.launcher;

import java.util.HashMap;
import java.util.Map;

public class Executable {

    private String testcaseUuid;

    private String projectId;

    private String launchId;

    private Map<String, String> metadata = new HashMap<>();

    public Executable() { }

    public Executable(String testcaseUuid, String projectId, String launchId, Map<String, String> metadata) {
        this.testcaseUuid = testcaseUuid;
        this.projectId = projectId;
        this.launchId = launchId;
        this.metadata = metadata;
    }

    public Map<String, String> getMetadata() {
        return metadata;
    }

    public void setMetadata(Map<String, String> metadata) {
        this.metadata = metadata;
    }

    public String getTestcaseUuid() {
        return testcaseUuid;
    }

    public void setTestcaseUuid(String testcaseUuid) {
        this.testcaseUuid = testcaseUuid;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getLaunchId() {
        return launchId;
    }

    public void setLaunchId(String launchId) {
        this.launchId = launchId;
    }
}
