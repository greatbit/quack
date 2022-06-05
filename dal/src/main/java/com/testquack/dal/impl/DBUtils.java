package com.testquack.dal.impl;

import com.testquack.beans.Filter;
import com.testquack.beans.Order;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.reflect.FieldUtils;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.mapreduce.MapReduceResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;
import ru.greatbit.utils.serialize.JsonSerializer;

import java.io.IOException;
import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import static org.apache.commons.lang3.StringUtils.isEmpty;

@Component
public class DBUtils {

    public static final String MAPREDUCE_PATH = "/map-reduce/";

    @Autowired
    MongoTemplate mongoTemplate;

    public MapReduceResults<Document> mapReduce(Class entityClass, String collectionName, String mapFileName, String reduceFileName, Filter filter)
            throws IOException {
        return mongoTemplate.mapReduce(getQuery(entityClass, filter), collectionName,
                IOUtils.toString(getClass().getResourceAsStream(MAPREDUCE_PATH + mapFileName), "UTF-8"),
                IOUtils.toString(getClass().getResourceAsStream(MAPREDUCE_PATH + reduceFileName), "UTF-8"),
                Document.class);
    }

    public <T> Map<String, T> mapReduce(Class entityClass, String collectionName, String mapFileName, String reduceFileName, Filter filter, Class<T> t)
            throws Exception {
        Map<String, T> result = new HashMap<>();
        for (Document document : mapReduce(entityClass, collectionName, mapFileName, reduceFileName, filter)) {
            if (document != null && document.get("_id") != null && document.get("value") != null) {
                result.put(document.get("_id").toString(),
                        JsonSerializer.unmarshal(((Document) document.get("value")).toJson(), t));
            }
        }
        return result;
    }

    public static Query getQuery(Class entityClass, Filter filter) {
        Criteria criteria = new Criteria();

        // Add AND fields criterias
        List<Criteria> andCriterias = filter.getFieldsForQuery().entrySet().stream().
                map(field -> getFieldCriteris(entityClass, field.getKey(), field.getValue())).collect(Collectors.toList());

        // Add fulltext search
        if (!isEmpty(filter.getFulltext())){
            List<Criteria> fulltextOrCriterias = filter.getFulltextSearchFields().stream()
                    .map(field -> new Criteria(field).regex(filter.getFulltext(), "i"))
                    .collect(Collectors.toList());
            Criteria fulltextOrCriteria = criteria.orOperator(fulltextOrCriterias);
            andCriterias.add(fulltextOrCriteria);
        }

        // Append AND criteria (should be single AND in the query)
        if (!andCriterias.isEmpty()) {
            criteria.andOperator(andCriterias.toArray(new Criteria[andCriterias.size()]));
        }


        // Add NOT fields criterias
        List<Criteria> notFieldsCriteria = filter.getNotFieldsForQuery().entrySet().stream().
                map(field -> new Criteria(field.getKey()).in(field.getValue())).collect(Collectors.toList());
        if (!notFieldsCriteria.isEmpty()) {
            criteria.norOperator(notFieldsCriteria.toArray(new Criteria[notFieldsCriteria.size()]));
        }



        // Add paging
        Query query = Query.query(criteria).skip(filter.getSkip()).limit(filter.getLimit());

        // Add included and excluded fields
        if (!filter.getIncludedFieldsForQuery().isEmpty()) {
            filter.getIncludedFieldsForQuery().forEach(field -> query.fields().include(field));
        }
        if (!filter.getExcludedFieldsForQuery().isEmpty()) {
            filter.getExcludedFieldsForQuery().forEach(field -> query.fields().exclude(field));
        }

        // Add ordering
        if (!isEmpty(filter.getSortField())) {
            Sort sort = filter.getOrder() != null && filter.getOrder().equals(Order.DESC) ?
                    Sort.by(Sort.Direction.DESC, filter.getSortField()) :
                    Sort.by(Sort.Direction.ASC, filter.getSortField());
            query.with(sort);
        }

        return query;
    }

    private static Criteria getFieldCriteris(Class entityClass, String key, Set<Object> values) {
        if (key.startsWith("like_")) {
            String effectiveKey = key.replace("like_", "");
            return new Criteria().orOperator((Criteria[]) values.stream().map(
                    value -> new Criteria(effectiveKey).regex(value.toString())
            ).collect(Collectors.toList()).toArray(new Criteria[values.size()]));
        }
        if (key.startsWith("from_")) {
            String effectiveKey = key.replace("from_", "");
            return new Criteria().orOperator((Criteria[]) values.stream().map(
                    value -> new Criteria(effectiveKey).gte(Long.parseLong(value.toString()))
            ).collect(Collectors.toList()).toArray(new Criteria[values.size()]));
        }
        if (key.startsWith("to_")) {
            String effectiveKey = key.replace("to_", "");
            return new Criteria().orOperator((Criteria[]) values.stream().map(
                    value -> new Criteria(effectiveKey).lte(Long.parseLong(value.toString()))
            ).collect(Collectors.toList()).toArray(new Criteria[values.size()]));
        }
        return new Criteria(key).in(getFieldValue(entityClass, key, values));
    }

    private static Set<Object> getFieldValue(Class entityClass, String key, Set<Object> values) {
        Class classToSearch = entityClass;
        Field field = FieldUtils.getField(classToSearch, "key", true);
        while (field == null && classToSearch.getSuperclass() != null) {
            classToSearch = classToSearch.getSuperclass();
            field = FieldUtils.getField(classToSearch, key, true);
        }
        if (field == null) {
            return values;
        }
        if (field.getType() == String.class) {
            return values;
        }
        if (field.getType() == Boolean.class || field.getType() == boolean.class) {
            return values.stream().map(DBUtils::toBoolean).collect(Collectors.toSet());
        }
        if (field.getType() == Integer.class || field.getType() == int.class) {
            return values.stream().map(DBUtils::toInteger).collect(Collectors.toSet());
        }
        if (field.getType() == Double.class || field.getType() == double.class) {
            return values.stream().map(DBUtils::toDouble).collect(Collectors.toSet());
        }
        if (field.getType() == Float.class || field.getType() == float.class) {
            return values.stream().map(DBUtils::toFloat).collect(Collectors.toSet());
        }
        return values;
    }

    private static float toFloat(Object value) {
        if (value == null) {
            return 0f;
        }
        return Float.parseFloat(value.toString());
    }

    private static double toDouble(Object value) {
        if (value == null) {
            return 0f;
        }
        return Double.parseDouble(value.toString());
    }

    private static int toInteger(Object value) {
        if (value == null) {
            return 0;
        }
        return Integer.parseInt(value.toString());
    }

    private static boolean toBoolean(Object value) {
        if (value == null) {
            return false;
        }
        if (value.toString().toLowerCase().equals("true")) {
            return true;
        }
        return false;
    }

    private static Criteria[] getCriteriasArray(List<Criteria> criterias) {
        Criteria[] criteriasArray = new Criteria[criterias.size()];
        for (int i = 0; i < criterias.size(); i++) {
            criteriasArray[i] = criterias.get(i);
        }
        return criteriasArray;
    }

}
