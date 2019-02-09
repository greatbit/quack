package ru.greatbit.quack.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.greatbit.quack.beans.*;
import ru.greatbit.quack.dal.CommonRepository;
import ru.greatbit.quack.dal.TestCaseRepository;
import ru.greatbit.whoru.auth.Session;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class TestCaseService extends BaseService<TestCase> {

    @Autowired
    private TestCaseRepository repository;

    @Autowired
    private SequencerService sequencerService;

    @Override
    protected CommonRepository<TestCase> getRepository() {
        return repository;
    }

    private final String UNKNOWN_GROUP = "None";

    public TestCaseTree findFilteredTree(Session session, String projectId, TestcaseFilter filter) {
        TestCaseTree head = new TestCaseTree();

        List<TestCase> testCases = super.findFiltered(session, projectId, filter);
        head.getTestCases().addAll(testCases);

        buildTree(head, new ArrayList<>(filter.getGroups()));
        return head;
    }

    private TestCaseTree buildTree(TestCaseTree head, List<String> groups) {
        if (groups.isEmpty()){
            head.setCount(head.getTestCases().size());
            return head;
        }

        String groupId = groups.get(0);
        List<String> nextGroups = groups.stream().skip(1).collect(Collectors.toList());

        Map<String, List<TestCase>> casesByGroupValues = new HashMap<>();
        head.getTestCases().forEach(testCase -> {
            Set<String> attrValues = testCase.getAttributes().entrySet().stream().
                    filter(attribute -> groupId.equals(attribute.getKey())).
                    flatMap(attribute -> attribute.getValue().stream()).
                    collect(Collectors.toSet());
            if (attrValues.isEmpty()){
                addToMapOfList(casesByGroupValues, UNKNOWN_GROUP, testCase);
            }
            attrValues.forEach(attributeVal -> addToMapOfList(casesByGroupValues, attributeVal, testCase));
        });

        casesByGroupValues.entrySet().stream().forEach(entry -> {
            TestCaseTree child = (TestCaseTree) new TestCaseTree().
                    withTestCases(entry.getValue()).
                    withTitle(entry.getKey()).
                    withId(groupId + ":" + entry.getKey());
            buildTree(child, nextGroups);
            head.getChildren().add(child);
        });

        head.setCount(head.getTestCases().size());
        head.getTestCases().clear();
        return head;

    }

    private void addToMapOfList(Map<String, List<TestCase>> casesByGroupValues, String attrValue, TestCase testCase){
        casesByGroupValues.putIfAbsent(attrValue, new ArrayList<>());
        casesByGroupValues.get(attrValue).add(testCase);
    }

    @Override
    protected void beforeCreate(Session session, String projectId, TestCase entity) {
        super.beforeCreate(session, projectId, entity);
        Sequencer sequencer = sequencerService.increment(projectId);
        entity.setId(Long.toString(sequencer.getIndex()));
    }
}
