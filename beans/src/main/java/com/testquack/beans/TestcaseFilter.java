package com.testquack.beans;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public class TestcaseFilter extends Filter {

    public TestcaseFilter(Filter filter) {
        super();
        this.excludedFields = filter.excludedFields;
        this.fields = filter.fields;
        this.includedFields = filter.includedFields;
        this.notFields = filter.notFields;
        this.limit = filter.limit;
        this.order = filter.order;
        this.skip = filter.skip;
        this.sortField = filter.sortField;
        this.fulltext = filter.fulltext;
    }

    @Override
    public Object createNewInstance() {
        return new TestcaseFilter();
    }

    public TestcaseFilter() {
        super();
    }

    private List<String> groups = new ArrayList<>();
    private List<Attribute> filters = new ArrayList<>();

    public List<String> getGroups() {
        return groups;
    }

    public List<Attribute> getFilters() {
        return filters;
    }

    public void setGroups(List<String> groups) {
        this.groups = groups;
    }

    public void setFilters(List<Attribute> filters) {
        this.filters = filters;
    }

    public TestcaseFilter withFilters(List<Attribute> filters){
        this.filters = filters;
        return this;
    }

    @Override
    public Map<String, Set<Object>> getFieldsForQuery() {
        Map<String, Set<Object>> fieldsFilterCopy = new HashMap<>(fields);
        filters.forEach(attributeFilter -> {
            String filterKey = "attributes." + attributeFilter.id;
            if (!fieldsFilterCopy.containsKey(filterKey)){
                fieldsFilterCopy.put(filterKey, new HashSet<>());
            }
            fieldsFilterCopy.get(filterKey).addAll(
                    attributeFilter.getAttrValues().stream()
                            .map(AttributeValue::getValue)
                            .collect(Collectors.toSet())
            );
        });
        return fieldsFilterCopy;
    }

    @Override
    public Set<String> getFulltextSearchFields() {
        Set<String> fulltextSearchFields = super.getFulltextSearchFields();
        fulltextSearchFields.add("description");
        fulltextSearchFields.add("preconditions");
        fulltextSearchFields.add("steps.action");
        fulltextSearchFields.add("steps.expectation");
        fulltextSearchFields.add("properties.value");
        fulltextSearchFields.add("id");
        return fulltextSearchFields;
    }
}
