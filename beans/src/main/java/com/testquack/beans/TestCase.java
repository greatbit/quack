package com.testquack.beans;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import static java.util.stream.Collectors.toList;

public class TestCase extends TestCaseBase {

    public TestCase() {
        super();
    }

    public TestCase(TestCasePreview testCasePreview){
        super();
        this.attributes = testCasePreview.getAttributes();
        this.automated = testCasePreview.isAutomated();
        this.broken = testCasePreview.isBroken();
        this.deleted = testCasePreview.isDeleted();
        this.id = testCasePreview.getId();
        this.importedName = testCasePreview.getImportedName();
        this.name = testCasePreview.getName();
    }

    private Map<String, Set<String>> attributes = new HashMap<>();

    private Map<String, Object> metaData = new HashMap<>();

    public Map<String, Set<String>> getAttributes() {
        return attributes;
    }

    public Map<String, Object> getMetaData() {
        return metaData;
    }

    public void addAttributeValue(Attribute attribute){
        Set<String> values = attributes.getOrDefault(attribute.getId(), new HashSet<>());
        values.addAll(attribute.getAttrValues().stream().map(AttributeValue::getValue).collect(toList()));
        attributes.put(attribute.getId(), values);
    }
}
