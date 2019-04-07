package ru.greatbit.quack.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.greatbit.quack.beans.*;
import ru.greatbit.quack.dal.CommonRepository;
import ru.greatbit.quack.dal.TestCaseRepository;
import ru.greatbit.quack.services.errors.EntityNotFoundException;
import ru.greatbit.quack.storage.Storage;
import ru.greatbit.quack.tracker.Tracker;
import ru.greatbit.whoru.auth.Session;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TestCaseService extends BaseService<TestCase> {

    @Autowired
    private TestCaseRepository repository;

    @Autowired
    private SequencerService sequencerService;

    @Autowired
    private Storage storage;

    @Autowired
    private Tracker tracker;

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

    public TestCase uploadAttachment(Session userSession, String projectId, String testcaseId, InputStream uploadedInputStream, String fileName, long size) throws IOException {
        Attachment attachment = storage.upload(uploadedInputStream, fileName, size);
        return update(userSession, projectId,
                (TestCase) new TestCase().withId(testcaseId).withLastModifiedTime(Long.MAX_VALUE),
                ((originalEntity, newEntity) -> {
            attachment.withId(UUID.randomUUID().toString()).
                    withCreatedBy(userSession.getLogin()).
                    withCreatedTime(System.currentTimeMillis()).
                    withDataSize(size);
            ((TestCase)originalEntity).getAttachments().add(attachment);
            return originalEntity;
        }));
    }

    public Attachment getAttachment(Session userSession, String projectId, String testcaseId, String attachmentId) {
        TestCase testCase = findOne(userSession, projectId, testcaseId);
        return getAttachment(testCase, attachmentId);
    }

    public TestCase deleteAttachment(Session userSession, String projectId, String testcaseId, String attachmentId) throws IOException {
        TestCase testCase = findOne(userSession, projectId, testcaseId);
        Attachment attachment = getAttachment(testCase, attachmentId);
        storage.remove(attachment);
        testCase.getAttachments().remove(attachment);
        return update(userSession, projectId, testCase);
    }

    private Attachment getAttachment(TestCase testCase, String attachmentId) {
        return testCase.getAttachments().stream().
                filter(attachment -> attachment.getId().equals(attachmentId)).
                findFirst().orElseThrow(EntityNotFoundException::new);
    }

    public InputStream getAttachmentStream(Attachment attachment) throws IOException {
        return storage.get(attachment);
    }

    public TestCase createIssue(HttpServletRequest request, Session userSession, String projectId, String testcaseId, Issue issue) {
        TestCase testCase = findOne(userSession, projectId, testcaseId);
        testCase.getIssues().add(tracker.createIssue(request, userSession, issue));
        return update(userSession, projectId, testCase);
    }

    public TestCase linkIssue(HttpServletRequest request, Session userSession, String projectId, String testcaseId, String issueId) {
        TestCase testCase = findOne(userSession, projectId, testcaseId);
        testCase.getIssues().add(tracker.linkIssue(request, userSession, issueId));
        return update(userSession, projectId, testCase);
    }


    public TestCase unlinkIssue(HttpServletRequest request, Session userSession, String projectId, String testcaseId, String issueId) {
        TestCase testCase = findOne(userSession, projectId, testcaseId);
        List<Issue> issues = testCase.getIssues().stream().filter(issue -> !issue.getId().equals(issueId)).
                collect(Collectors.toList());
        testCase.setIssues(issues);
        return update(userSession, projectId, testCase);
    }

    public List<Issue> suggestIssue(HttpServletRequest request, Session userSession, String issueProject, String text) {
        return tracker.suggestIssue(request, userSession, issueProject, text);
    }

    public List<String> suggestProjects(HttpServletRequest request, Session userSession, String projectId, String text) {
        return tracker.suggestProjects(request, userSession, projectId, text);
    }
}
