package ru.greatbit.quack.beans;

import java.util.*;

public class Filter extends BaseFilter{

    protected Map<String, Set<Object>> fields;
    protected Map<String, Set<Object>> notFields;
    protected Set<String> excludedFields;
    protected Set<String> includedFields;

    public Map<String, Set<Object>> getFields() {
        if (fields == null){
            fields = new HashMap<>();
        }
        return fields;
    }

    public Map<String, Set<Object>> getNotFields() {
        if (notFields == null){
            notFields = new HashMap<>();
        }
        return notFields;
    }

    public Set<String> getExcludedFields() {
        if (excludedFields == null){
            excludedFields = new HashSet<>();
        }
        return excludedFields;
    }

    public Set<String> getIncludedFields() {
        if (includedFields == null){
            includedFields = new HashSet<>();
        }
        return includedFields;
    }

    public Filter withField(String fieldName, Object fieldValue){
        getFields().putIfAbsent(fieldName, new HashSet<>());
        getFields().get(fieldName).add(fieldValue);
        return this;
    }

    public Filter withNotField(String fieldName, Object fieldValue){
        getNotFields().putIfAbsent(fieldName, new HashSet<>());
        getNotFields().get(fieldName).add(fieldValue);
        return this;
    }

    public Filter withIncludedField(String fieldName){
        getIncludedFields().add(fieldName);
        return this;
    }

    public Filter withExcludedField(String fieldName){
        getExcludedFields().add(fieldName);
        return this;
    }

    @Override
    public Filter withSortField(String value) {
        return (Filter) super.withSortField(value);
    }

    @Override
    public Filter withOrder(Order value) {
        return (Filter) super.withOrder(value);
    }
}
