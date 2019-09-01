package com.testquack.beans;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class TestCasePreview extends TestcasePreviewBase {

    private Map<String, Set<String>> attributes = new HashMap<>();

    public Map<String, Set<String>> getAttributes() {
        return attributes;
    }
}
