package com.testquack.dal;

import com.testquack.beans.Filter;
import com.testquack.beans.TestCase;
import org.junit.Test;

import java.util.List;

import static java.util.stream.Collectors.toList;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.junit.Assert.assertThat;

public class CommonRepositoryTest extends DalBaseTest {

    @Test
    public void fromTest() {
        TestCase tc1 = testCaseRepository.save(null, project1.getId(), (TestCase) new TestCase().withCreatedTime(1L));
        TestCase tc2 = testCaseRepository.save(null, project1.getId(), (TestCase) new TestCase().withCreatedTime(2L));
        TestCase tc3 = testCaseRepository.save(null, project1.getId(), (TestCase) new TestCase().withCreatedTime(3L));

        Filter filter = new Filter();
        filter.addFields("from_createdTime", "1");

        List<TestCase> testCases = testCaseRepository.find(null, project1.getId(), filter);
        assertThat(testCases.size(), is(3));
        assertThat(testCases.stream().map(TestCase::getId).collect(toList()),
                containsInAnyOrder(tc1.getId(), tc2.getId(), tc3.getId()));

        filter.getFields().get("from_createdTime").clear();
        filter.addFields("from_createdTime", "2");

        testCases = testCaseRepository.find(null, project1.getId(), filter);
        assertThat(testCases.size(), is(2));
        assertThat(testCases.stream().map(TestCase::getId).collect(toList()),
                containsInAnyOrder(tc2.getId(), tc3.getId()));
    }

    @Test
    public void toTest() {
        TestCase tc1 = testCaseRepository.save(null, project1.getId(), (TestCase) new TestCase().withCreatedTime(1L));
        TestCase tc2 = testCaseRepository.save(null, project1.getId(), (TestCase) new TestCase().withCreatedTime(2L));
        TestCase tc3 = testCaseRepository.save(null, project1.getId(), (TestCase) new TestCase().withCreatedTime(3L));

        Filter filter = new Filter();
        filter.addFields("to_createdTime", "3");

        List<TestCase> testCases = testCaseRepository.find(null, project1.getId(), filter);
        assertThat(testCases.size(), is(3));
        assertThat(testCases.stream().map(TestCase::getId).collect(toList()),
                containsInAnyOrder(tc1.getId(), tc2.getId(), tc3.getId()));

        filter.getFields().get("to_createdTime").clear();
        filter.addFields("to_createdTime", "2");

        testCases = testCaseRepository.find(null, project1.getId(), filter);
        assertThat(testCases.size(), is(2));
        assertThat(testCases.stream().map(TestCase::getId).collect(toList()),
                containsInAnyOrder(tc1.getId(), tc2.getId()));
    }

    @Test
    public void fromToTest() {
        TestCase tc1 = testCaseRepository.save(null, project1.getId(), (TestCase) new TestCase().withCreatedTime(1L));
        TestCase tc2 = testCaseRepository.save(null, project1.getId(), (TestCase) new TestCase().withCreatedTime(2L));
        TestCase tc3 = testCaseRepository.save(null, project1.getId(), (TestCase) new TestCase().withCreatedTime(3L));

        Filter filter = new Filter();
        filter.addFields("from_createdTime", "1");
        filter.addFields("to_createdTime", "3");

        List<TestCase> testCases = testCaseRepository.find(null, project1.getId(), filter);
        assertThat(testCases.size(), is(3));
        assertThat(testCases.stream().map(TestCase::getId).collect(toList()),
                containsInAnyOrder(tc1.getId(), tc2.getId(), tc3.getId()));

        filter.getFields().get("from_createdTime").clear();
        filter.getFields().get("to_createdTime").clear();
        filter.addFields("from_createdTime", "1");
        filter.addFields("to_createdTime", "2");

        testCases = testCaseRepository.find(null, project1.getId(), filter);
        assertThat(testCases.size(), is(2));
        assertThat(testCases.stream().map(TestCase::getId).collect(toList()),
                containsInAnyOrder(tc1.getId(), tc2.getId()));
    }


}
