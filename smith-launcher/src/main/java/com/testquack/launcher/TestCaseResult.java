package com.testquack.launcher;

public class TestCaseResult {

    protected String projectId;
    protected String launchId;
    protected String testcaseUuid;
    protected String logsPath;
    protected boolean passed;
    protected String message;

    public TestCaseResult() {
    }

    public TestCaseResult(String projectId, String launchId, String testcaseUuid, String logsPath, boolean passed, String message) {
        this.projectId = projectId;
        this.launchId = launchId;
        this.testcaseUuid = testcaseUuid;
        this.logsPath = logsPath;
        this.passed = passed;
        this.message = message;
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

    public String getTestcaseUuid() {
        return testcaseUuid;
    }

    public void setTestcaseUuid(String testcaseUuid) {
        this.testcaseUuid = testcaseUuid;
    }

    public String getLogsPath() {
        return logsPath;
    }

    public void setLogsPath(String logsPath) {
        this.logsPath = logsPath;
    }

    public boolean isPassed() {
        return passed;
    }

    public void setPassed(boolean passed) {
        this.passed = passed;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
