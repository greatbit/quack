package com.testquack.api.utils;

import com.testquack.beans.Filter;
import com.testquack.beans.Order;

import javax.servlet.http.HttpServletRequest;
import java.util.Arrays;

public class FilterUtils {

    public final static String SKIP = "skip";
    public final static String LIMIT = "limit";
    public final static String DELETED = "deleted";
    public final static String ORDER_BY = "orderby";
    public final static String ORDER_DIR = "orderdir";
    public final static String INCLUDED_FIELDS = "includedFields";
    public final static String EXCLUDED_FIELDS = "excludedFields";
    public final static String NOT_PREFIX = "not_";
    public final static String FULLTEXT = "fulltext";


    public static Filter initFilter(HttpServletRequest hsr) {
        Filter filter = new Filter().withField(DELETED, false);
        if (hsr.getParameter(SKIP) != null) {
            filter.setSkip(Integer.parseInt(hsr.getParameter(SKIP)));
        }
        if (hsr.getParameter(LIMIT) != null) {
            filter.setLimit(Integer.parseInt(hsr.getParameter(LIMIT)));
        }
        if (hsr.getParameter(FULLTEXT) != null) {
            filter.setFulltext(hsr.getParameter(FULLTEXT));
        }

        //Add fields filter
        hsr.getParameterMap().entrySet().stream().
                filter(entry -> !entry.getKey().equals(SKIP) &&
                        !entry.getKey().equals(LIMIT) &&
                        !entry.getKey().equals(FULLTEXT) ).
                filter(entry -> !entry.getKey().startsWith(NOT_PREFIX)).
                filter(entry -> !entry.getKey().startsWith(ORDER_BY)).
                filter(entry -> !entry.getKey().startsWith(ORDER_DIR)).
                filter(entry -> !entry.getKey().startsWith(INCLUDED_FIELDS)).
                filter(entry -> !entry.getKey().startsWith(EXCLUDED_FIELDS)).
                forEach(entry -> filter.addFields(entry.getKey(), entry.getValue()));

        //Add NOT fields filter
        hsr.getParameterMap().entrySet().stream().
                filter(entry -> entry.getKey().startsWith(NOT_PREFIX)).
                forEach(entry -> filter.addNotFields(entry.getKey().replace(NOT_PREFIX, ""), entry.getValue()));

        //Included and Excluded fields
        if (hsr.getParameter(INCLUDED_FIELDS) != null) {
            filter.getIncludedFields().addAll(Arrays.asList(hsr.getParameter(INCLUDED_FIELDS).split(",")));
        }
        if (hsr.getParameter(EXCLUDED_FIELDS) != null) {
            filter.getIncludedFields().addAll(Arrays.asList(hsr.getParameter(EXCLUDED_FIELDS).split(",")));
        }

        //Sort order
        if (hsr.getParameter("orderby") != null) {
            filter.setSortField(hsr.getParameter("orderby"));
            try {
                filter.setOrder(Order.fromValue(hsr.getParameter("orderdir")));
            } catch (Exception e) {
                filter.setOrder(Order.ASC);
            }
        }
        return filter;
    }
}
