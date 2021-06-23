package com.testquack.services;

import com.testquack.beans.AttributeValue;
import com.testquack.beans.TestCase;
import com.testquack.beans.TestcaseFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.testquack.beans.Attribute;
import com.testquack.dal.AttributeRepository;
import com.testquack.dal.CommonRepository;
import ru.greatbit.whoru.auth.Session;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toMap;
import static org.apache.commons.lang3.StringUtils.isEmpty;

@Service
public class AttributeService extends BaseService<Attribute> {

    @Autowired
    private TestCaseService testCaseService;

    @Autowired
    private AttributeRepository repository;

    @Override
    protected CommonRepository<Attribute> getRepository() {
        return repository;
    }

    @Override
    protected void beforeSave(Session session, String projectId, Attribute entity) {
        super.beforeSave(session, projectId, convertStringValiedToObjects(entity));

        // Only unique attribute values should retain
        Set<String> existingValues = new HashSet<>();
        List<AttributeValue> filteredValues = new ArrayList<>();
        entity.getAttrValues().forEach(valueObject -> {
            if (!existingValues.contains(valueObject.getValue())){
                existingValues.add(valueObject.getValue());
                filteredValues.add(valueObject);
            }
        });

        entity.setAttrValues(filteredValues);

        // Create UUID for new values
        entity.getAttrValues().stream()
                .filter(valueObj -> isEmpty(valueObj.getUuid()))
                .forEach(valueObj -> valueObj.setUuid(UUID.randomUUID().toString()));
    }

    @Override
    protected Attribute beforeReturn(Session session, String projectId, Attribute entity) {
        return convertStringValiedToObjects(entity);
    }

    @Override
    protected void afterUpdate(Session session, String projectId, Attribute previousEntity, Attribute entity) {
        super.afterUpdate(session, projectId, previousEntity, entity);
        Map<String, AttributeValue> newValues = entity.getAttrValues().stream()
                .collect(toMap(AttributeValue::getUuid, Function.identity()));

        Map<String, String> changedValues = new HashMap<>();
        previousEntity.getAttrValues().stream()
                .filter(attributeValue -> newValues.containsKey(attributeValue.getUuid()))
                .filter(attributeValue -> !newValues.get(attributeValue.getUuid()).getValue().equals(attributeValue.getValue()))
                .forEach(attributeValue -> changedValues.put(attributeValue.getValue(), newValues.get(attributeValue.getUuid()).getValue()));

        TestcaseFilter testcaseFilter = new TestcaseFilter().withFilters(
                Collections.singletonList(
                        new Attribute()
                                .withId(entity.getId())
                                .withAttrValues(
                                        changedValues.keySet().stream()
                                                .map(value -> new AttributeValue().withValue(value)).
                                                collect(Collectors.toSet())
                                )
                )
        );

        List<TestCase> affectedTestcases = testCaseService.findFiltered(session, projectId, testcaseFilter);
        affectedTestcases.forEach(testCase -> {
            Set<String> newTestcaseAttributeValues = testCase.getAttributes().get(entity.getId()).stream()
                    .map(value -> changedValues.containsKey(value) ? changedValues.get(value) : value)
                    .collect(Collectors.toSet());
            testCase.getAttributes().put(entity.getId(), newTestcaseAttributeValues);
        });
        testCaseService.save(session, projectId, affectedTestcases);
    }

    /**
     *
     * Attribute values migrated from strings to objects
     * Following piece of code performs lazy migration
     * Deprecate it at some point
     * @param attribute
     * @return
     */
    private Attribute convertStringValiedToObjects(Attribute attribute){
        Set<String> objectValues = attribute.getAttrValues().stream()
                .map(AttributeValue::getValue).collect(Collectors.toSet());

        attribute.getValues().stream()
                .filter(strValue -> !objectValues.contains(strValue))
                .map(strValue -> new AttributeValue().withValue(strValue).withUuid(UUID.randomUUID().toString()))
                .forEach(newObjectValue -> attribute.getAttrValues().add(newObjectValue));
        attribute.getValues().clear();
        return attribute;
    }
}
