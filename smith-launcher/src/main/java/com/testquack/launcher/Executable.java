package com.testquack.launcher;

import java.util.HashMap;
import java.util.Map;

public class Executable {

    private String testcaseUuid;

    private Map<String, String> metadata = new HashMap<>();

    public Executable() { }

    public Executable(String testcaseUuid, Map<String, String> metadata) {
        this.testcaseUuid = testcaseUuid;
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
}
