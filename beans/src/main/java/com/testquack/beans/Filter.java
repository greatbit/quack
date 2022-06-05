package com.testquack.beans;

import java.util.*;
import java.util.stream.Collectors;

import static java.util.Arrays.asList;

public class Filter extends BaseFilter{

    protected Map<String, Set<Object>> fields = new HashMap<>();
    protected Map<String, Set<Object>> notFields = new HashMap<>();
    protected Set<String> excludedFields = new HashSet<>();
    protected Set<String> includedFields = new HashSet<>();

    public Map<String, Set<Object>> getFields() {
        return fields;
    }

    public Map<String, Set<Object>> getFieldsForQuery() {
        return fields;
    }

    public Map<String, Set<Object>> getNotFields() {
        return notFields;
    }

    public Map<String, Set<Object>> getNotFieldsForQuery() {
        return notFields;
    }

    public Set<String> getExcludedFields() {
        return excludedFields;
    }

    public Set<String> getExcludedFieldsForQuery() {
        return excludedFields;
    }

    public Set<String> getIncludedFields() {
        return includedFields;
    }

    public Set<String> getIncludedFieldsForQuery() {
        return includedFields;
    }

    public Filter withField(String fieldName, Object... fieldValues) {
        fields.putIfAbsent(fieldName, new HashSet<>());
        fields.get(fieldName).addAll(asList(fieldValues));
        return this;
    }

    public Filter withNotField(String fieldName, Object... fieldValue) {
        notFields.putIfAbsent(fieldName, new HashSet<>());
        notFields.get(fieldName).addAll(asList(fieldValue));
        return this;
    }

    public Filter withIncludedField(String fieldName){
        includedFields.add(fieldName);
        return this;
    }

    public Filter withExcludedField(String fieldName){
        excludedFields.add(fieldName);
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

    private void addValuesToMap(Map<String, Set<Object>> map, String key, String... values){
        Set<Object> mappedValues = map.getOrDefault(key, new HashSet<>());
        mappedValues.addAll(asList(values));
        map.put(key, mappedValues);
    }

    public void addFields(String key, String... values){
        addValuesToMap(fields, key, values);
    }

    public void addFields(String key, List<String> values){
        addValuesToMap(fields, key, values.toArray(new String[values.size()]));
    }

    public void addNotFields(String key, String... values){
        addValuesToMap(notFields, key, values);
    }

    @Override
    public Object createNewInstance() {
        return new Filter();
    }

    public Set<String> getFulltextSearchFields(){
        return Arrays.asList("name").stream().collect(Collectors.toSet());
    }
}
