package com.testquack.beans;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class TestCase extends TestCaseBase {

    private Map<String, Set<String>> attributes = new HashMap<>();

    public Map<String, Set<String>> getAttributes() {
        return attributes;
    }

    public void addValue(Attribute attribute){
        Set<String> values = attributes.getOrDefault(attribute.getId(), new HashSet<>());
        values.addAll(attribute.getValues());
        attributes.put(attribute.getId(), values);
    }
}
