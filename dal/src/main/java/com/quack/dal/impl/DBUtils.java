package com.quack.dal.impl;

import com.mongodb.DBObject;
import com.quack.beans.Filter;
import com.quack.beans.Order;
import org.apache.commons.io.IOUtils;
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

    public MapReduceResults<Document> mapReduce(String collectionName, String mapFileName, String reduceFileName, Filter filter)
            throws IOException {
        return mongoTemplate.mapReduce(getQuery(filter), collectionName,
                IOUtils.toString(getClass().getResourceAsStream(MAPREDUCE_PATH + mapFileName), "UTF-8"),
                IOUtils.toString(getClass().getResourceAsStream(MAPREDUCE_PATH + reduceFileName), "UTF-8"),
                Document.class);
    }

    public <T> Map<String, T> mapReduce(String collectionName, String mapFileName, String reduceFileName, Filter filter, Class<T> t)
            throws Exception {
        Map<String, T> result = new HashMap<>();
        for (Document document : mapReduce(collectionName, mapFileName, reduceFileName, filter)) {
            if (document != null && document.get("_id") != null && document.get("value") != null) {
                result.put(document.get("_id").toString(),
                        JsonSerializer.unmarshal(((Document) document.get("value")).toJson(), t));
            }
        }
        return result;
    }

    public static Query getQuery(Filter filter) {
        Criteria criteria = new Criteria();

        // Add AND fields criterias
        List<Criteria> fieldsCriteria = filter.getFields().entrySet().stream().
                map(field -> getFieldCriteris(field.getKey(), field.getValue())).collect(Collectors.toList());
        if (!fieldsCriteria.isEmpty()) {
            criteria.andOperator(fieldsCriteria.toArray(new Criteria[fieldsCriteria.size()]));
        }


        // Add NOT fields criterias
        List<Criteria> notFieldsCriteria = filter.getNotFields().entrySet().stream().
                map(field -> new Criteria(field.getKey()).in(field.getValue())).collect(Collectors.toList());
        if (!notFieldsCriteria.isEmpty()) {
            criteria.norOperator(notFieldsCriteria.toArray(new Criteria[notFieldsCriteria.size()]));
        }

        // Add paging
        Query query = Query.query(criteria).skip(filter.getSkip()).limit(filter.getLimit());

        // Add included and excluded fields
        if (!filter.getIncludedFields().isEmpty()) {
            filter.getIncludedFields().forEach(field -> query.fields().include(field));
        }
        if (!filter.getExcludedFields().isEmpty()) {
            filter.getExcludedFields().forEach(field -> query.fields().exclude(field));
        }

        // Add ordering
        if (!isEmpty(filter.getSortField())) {
            Sort sort = filter.getOrder() != null && filter.getOrder().equals(Order.DESC) ?
                    new Sort(Sort.Direction.DESC, filter.getSortField()) :
                    new Sort(Sort.Direction.ASC, filter.getSortField());
            query.with(sort);
        }

        return query;
    }

    private static Criteria getFieldCriteris(String key, Set<Object> values) {
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
        return new Criteria(key).in(values);
    }

    private static Criteria[] getCriteriasArray(List<Criteria> criterias) {
        Criteria[] criteriasArray = new Criteria[criterias.size()];
        for (int i = 0; i < criterias.size(); i++) {
            criteriasArray[i] = criterias.get(i);
        }
        return criteriasArray;
    }

}
