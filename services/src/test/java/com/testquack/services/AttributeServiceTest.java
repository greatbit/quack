package com.testquack.services;

import com.testquack.beans.Attribute;
import com.testquack.beans.AttributeValue;
import com.testquack.beans.TestCase;
import com.testquack.beans.TestcaseFilter;
import org.junit.Test;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static java.util.stream.Collectors.toList;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertThat;


public class AttributeServiceTest extends BaseTest {

    @Test
    public void uniqueAttributeValuesStoreTest(){
        Attribute attribute = new Attribute();
        attribute.getAttrValues().add(new AttributeValue().withValue("a1").withUuid("1"));
        attribute.getAttrValues().add(new AttributeValue().withValue("b2").withUuid("2"));
        attribute.getAttrValues().add(new AttributeValue().withValue("a1").withUuid("3"));

        Attribute savedAttribute = attributeService.create(adminSession, project1.getId(), attribute);
        assertThat(savedAttribute.getAttrValues().size(), is(2));
        assertThat(savedAttribute.getAttrValues().stream()
                .map(AttributeValue::getUuid)
                .collect(toList()), containsInAnyOrder("1", "2"));
        assertThat(savedAttribute.getAttrValues().stream()
                .map(AttributeValue::getValue)
                .collect(toList()), containsInAnyOrder("a1", "b2"));
    }

    @Test
    public void uuidsAreSetForValues(){
        Attribute attribute = new Attribute();
        attribute.getAttrValues().add(new AttributeValue().withValue("a1").withUuid("1"));
        attribute.getAttrValues().add(new AttributeValue().withValue("b2"));

        Attribute savedAttribute = attributeService.create(adminSession, project1.getId(), attribute);
        assertThat(savedAttribute.getAttrValues().size(), is(2));


        AttributeValue one = attribute.getAttrValues().stream()
                .filter(attrValue -> attrValue.getValue().equals("a1"))
                .findFirst().orElse(null);
        assertNotNull(one);
        assertThat(one.getUuid(), is("1"));


        AttributeValue two = attribute.getAttrValues().stream()
                .filter(attrValue -> attrValue.getValue().equals("b2"))
                .findFirst().orElse(null);
        assertNotNull(two);
        assertNotNull(two.getUuid());
    }


    @Test
    public void attributeChangeValue(){
        Attribute attributeOne = new Attribute();
        attributeOne.getAttrValues().add(new AttributeValue().withValue("a1").withUuid("1"));
        attributeOne.getAttrValues().add(new AttributeValue().withValue("b2").withUuid("2"));
        attributeOne = attributeService.save(adminSession, project1.getId(), attributeOne);

        Attribute attributeTwo = new Attribute();
        attributeTwo.getAttrValues().add(new AttributeValue().withValue("c3").withUuid("1"));
        attributeTwo.getAttrValues().add(new AttributeValue().withValue("d4").withUuid("2"));
        attributeTwo = attributeService.save(adminSession, project1.getId(), attributeTwo);

        TestCase attrsTestCase1 = new TestCase();

        Set<String> attrValuesForAttr1 = new HashSet<>();
        attrValuesForAttr1.add("a1");
        attrValuesForAttr1.add("b2");
        attrsTestCase1.getAttributes().put(attributeOne.getId(), attrValuesForAttr1);

        Set<String> attrValuesForAttr2 = new HashSet<>();
        attrValuesForAttr2.add("c3");
        attrsTestCase1.getAttributes().put(attributeTwo.getId(), attrValuesForAttr2);

        TestCase attrsTestCase2 = (TestCase) attrsTestCase1.copyTo(new TestCase());
        attrsTestCase2.getAttributes().put(attributeOne.getId(), attrValuesForAttr1);
        attrsTestCase2.getAttributes().put(attributeTwo.getId(), attrValuesForAttr2);

        //Create 2 testcases
        attrsTestCase1 = testCaseService.create(adminSession, project1.getId(), attrsTestCase1);
        attrsTestCase2 = testCaseService.create(adminSession, project1.getId(), attrsTestCase2);

        //Update attribute
        attributeOne.getAttrValues().get(0).setValue("f0");
        attributeService.update(adminSession, project1.getId(), attributeOne);

        TestcaseFilter filter = new TestcaseFilter();
        filter.addFields("id", attrsTestCase1.getId(), attrsTestCase2.getId());
        List<TestCase> testCases = testCaseService.findFiltered(adminSession, project1.getId(), filter);

        final String attributeOneId = attributeOne.getId();
        testCases.forEach(storedTestCase ->
            assertThat(storedTestCase.getAttributes().get(attributeOneId), containsInAnyOrder("f0", "b2"))
        );

        final String attributeTwoId = attributeTwo.getId();
        testCases.forEach(storedTestCase ->
                assertThat(storedTestCase.getAttributes().get(attributeTwoId), containsInAnyOrder("c3"))
        );
    }

    @Test
    public void attributeDontChangeValue(){
        Attribute attributeOne = new Attribute();
        attributeOne.getAttrValues().add(new AttributeValue().withValue("a1").withUuid("1"));
        attributeOne = attributeService.save(adminSession, project1.getId(), attributeOne);

        Attribute attributeTwo = new Attribute();
        attributeTwo.getAttrValues().add(new AttributeValue().withValue("c3").withUuid("1"));
        attributeTwo = attributeService.save(adminSession, project1.getId(), attributeTwo);

        TestCase attrsTestCase1 = new TestCase();
        Set<String> attrValuesForAttr2 = new HashSet<>();
        attrValuesForAttr2.add("c3");
        attrsTestCase1.getAttributes().put(attributeTwo.getId(), attrValuesForAttr2);

        TestCase attrsTestCase2 = (TestCase) attrsTestCase1.copyTo(new TestCase());
        attrsTestCase2.getAttributes().put(attributeTwo.getId(), attrValuesForAttr2);

        //Create 2 testcases
        attrsTestCase1 = testCaseService.create(adminSession, project1.getId(), attrsTestCase1);
        attrsTestCase2 = testCaseService.create(adminSession, project1.getId(), attrsTestCase2);

        //Update attribute
        attributeOne.getAttrValues().get(0).setValue("f0");
        attributeService.update(adminSession, project1.getId(), attributeOne);

        TestcaseFilter filter = new TestcaseFilter();
        filter.addFields("id", attrsTestCase1.getId(), attrsTestCase2.getId());
        List<TestCase> testCases = testCaseService.findFiltered(adminSession, project1.getId(), filter);

        final String attributeId = attributeTwo.getId();
        final Set<String> expectedValues = attrsTestCase1.getAttributes().get(attributeTwo.getId());
        testCases.forEach(storedTestCase ->
                assertThat(storedTestCase.getAttributes().get(attributeId),
                        containsInAnyOrder(expectedValues.toArray()))
        );
    }

    @Test
    public void attributeDeleted() {
        Attribute attributeOne = new Attribute();
        attributeOne.getAttrValues().add(new AttributeValue().withValue("a1").withUuid("1"));
        attributeOne.getAttrValues().add(new AttributeValue().withValue("b2").withUuid("2"));
        attributeOne = attributeService.save(adminSession, project1.getId(), attributeOne);

        Attribute attributeTwo = new Attribute();
        attributeTwo.getAttrValues().add(new AttributeValue().withValue("c3").withUuid("1"));
        attributeTwo.getAttrValues().add(new AttributeValue().withValue("d4").withUuid("2"));
        attributeTwo = attributeService.save(adminSession, project1.getId(), attributeTwo);

        TestCase attrsTestCase1 = new TestCase();

        Set<String> attrValuesForAttr1 = new HashSet<>();
        attrValuesForAttr1.add("a1");
        attrValuesForAttr1.add("b2");
        attrsTestCase1.getAttributes().put(attributeOne.getId(), attrValuesForAttr1);

        Set<String> attrValuesForAttr2 = new HashSet<>();
        attrValuesForAttr2.add("c3");
        attrsTestCase1.getAttributes().put(attributeTwo.getId(), attrValuesForAttr2);

        TestCase attrsTestCase2 = (TestCase) attrsTestCase1.copyTo(new TestCase());
        attrsTestCase2.getAttributes().put(attributeOne.getId(), attrValuesForAttr1);
        attrsTestCase2.getAttributes().put(attributeTwo.getId(), attrValuesForAttr2);

        //Create 2 testcases
        attrsTestCase1 = testCaseService.create(adminSession, project1.getId(), attrsTestCase1);
        attrsTestCase2 = testCaseService.create(adminSession, project1.getId(), attrsTestCase2);

        //Update attribute
        attributeService.delete(adminSession, project1.getId(), attributeOne.getId());

        TestcaseFilter filter = new TestcaseFilter();
        filter.addFields("id", attrsTestCase1.getId(), attrsTestCase2.getId());
        List<TestCase> testCases = testCaseService.findFiltered(adminSession, project1.getId(), filter);

        final String attributeOneId = attributeOne.getId();
        testCases.forEach(storedTestCase ->
                assertNull(storedTestCase.getAttributes().get(attributeOneId))
        );

        final String attributeTwoId = attributeTwo.getId();
        testCases.forEach(storedTestCase ->
                assertThat(storedTestCase.getAttributes().get(attributeTwoId), containsInAnyOrder("c3"))
        );
    }

    @Test
    public void attributeValueAddedTest(){
        Attribute attributeOne = new Attribute();
        attributeOne.getAttrValues().add(new AttributeValue().withValue("a1").withUuid("1"));
        attributeOne.getAttrValues().add(new AttributeValue().withValue("b2").withUuid("2"));
        attributeOne = attributeService.save(adminSession, project1.getId(), attributeOne);

        TestCase attrsTestCase1 = new TestCase();

        Set<String> attrValuesForAttr1 = new HashSet<>();
        attrValuesForAttr1.add("a1");
        attrValuesForAttr1.add("b2");
        attrsTestCase1.getAttributes().put(attributeOne.getId(), attrValuesForAttr1);
        attrsTestCase1 = testCaseService.create(adminSession, project1.getId(), attrsTestCase1);

        attributeOne.getAttrValues().add(new AttributeValue().withValue("c3").withUuid("3"));
        attributeService.save(adminSession, project1.getId(), attributeOne);

        TestcaseFilter filter = new TestcaseFilter();
        filter.addFields("id", attrsTestCase1.getId());
        attrsTestCase1 = testCaseService.findOne(adminSession, project1.getId(), attrsTestCase1.getId());

        assertThat(attrsTestCase1.getAttributes().get(attributeOne.getId()).size(), is(2));
        assertThat(attrsTestCase1.getAttributes().get(attributeOne.getId()), containsInAnyOrder("a1", "b2"));

    }

    @Test
    public void attributeValueDeletedTest(){
        Attribute attributeOne = new Attribute();
        attributeOne.getAttrValues().add(new AttributeValue().withValue("a1").withUuid("1"));
        attributeOne.getAttrValues().add(new AttributeValue().withValue("b2").withUuid("2"));
        attributeOne = attributeService.save(adminSession, project1.getId(), attributeOne);

        TestCase attrsTestCase1 = new TestCase();

        Set<String> attrValuesForAttr1 = new HashSet<>();
        attrValuesForAttr1.add("a1");
        attrValuesForAttr1.add("b2");
        attrsTestCase1.getAttributes().put(attributeOne.getId(), attrValuesForAttr1);
        attrsTestCase1 = testCaseService.create(adminSession, project1.getId(), attrsTestCase1);

        attributeOne.getAttrValues().clear();
        attributeOne.getAttrValues().add(new AttributeValue().withValue("a1").withUuid("1"));
        attributeService.save(adminSession, project1.getId(), attributeOne);

        TestcaseFilter filter = new TestcaseFilter();
        filter.addFields("id", attrsTestCase1.getId());
        attrsTestCase1 = testCaseService.findOne(adminSession, project1.getId(), attrsTestCase1.getId());

        assertThat(attrsTestCase1.getAttributes().get(attributeOne.getId()).size(), is(1));
        assertThat(attrsTestCase1.getAttributes().get(attributeOne.getId()), containsInAnyOrder("a1"));
    }

}
