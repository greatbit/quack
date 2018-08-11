package ru.greatbit.quack.beans;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

public class TestcaseFilter extends Filter{

    private Set<String> groups = new LinkedHashSet<>();
    private List<Attribute> filters = new ArrayList<>();

    public Set<String> getGroups() {
        return groups;
    }

    public List<Attribute> getFilters() {
        return filters;
    }
}
