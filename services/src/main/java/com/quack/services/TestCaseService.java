package com.quack.services;

import com.quack.beans.Attachment;
import com.quack.beans.Attribute;
import com.quack.beans.Filter;
import com.quack.beans.Issue;
import com.quack.beans.IssuePriority;
import com.quack.beans.IssueType;
import com.quack.beans.Sequencer;
import com.quack.beans.TestCase;
import com.quack.beans.TestCaseTree;
import com.quack.beans.TestcaseFilter;
import com.quack.beans.TrackerProject;
import com.quack.services.errors.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.quack.dal.CommonRepository;
import com.quack.dal.TestCaseRepository;
import com.quack.storage.Storage;
import com.quack.tracker.Tracker;
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
    private AttributeService attributeService;

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
        filter.getIncludedFields().addAll(Arrays.asList("name", "id", "attributes"));

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

    @Override
    protected void beforeSave(Session session, String projectId, TestCase entity) {
        super.beforeSave(session, projectId, entity);
        createMissingAttributes(session, projectId, entity);
    }

    private TestCase createMissingAttributes(Session session, String projectId, TestCase testCase) {
        Filter attributeFilter = new Filter().withIncludedField("id");
        List<Attribute> attributes = attributeService.findFiltered(session, projectId, attributeFilter);
        if (attributes.size() == 0) {
            return testCase;
        }

        Set<String> attributeKeys = attributes.stream().map(Attribute::getId).collect(Collectors.toSet());
        Map<String, Set<String>> newAttributes = new HashMap<>();
        testCase.getAttributes().entrySet().forEach(attribute -> {
            if (!attributeKeys.contains(attribute.getKey())) {
                Attribute newAttribute = attributeService.create(session, projectId,
                        new Attribute().withValues(attribute.getValue()).withName(attribute.getKey())
                );
                newAttributes.put(newAttribute.getId(), attribute.getValue());
            } else {
                newAttributes.put(attribute.getKey(), attribute.getValue());
            }
        });
        testCase.getAttributes().clear();
        testCase.getAttributes().putAll(newAttributes);
        return testCase;
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

    public TestCase createIssue(HttpServletRequest request, Session userSession, String projectId, String testcaseId, Issue issue) throws Exception {
        TestCase testCase = findOne(userSession, projectId, testcaseId);
        testCase.getIssues().add(tracker.createIssue(request, userSession, issue));
        return update(userSession, projectId, testCase);
    }

    public Issue getIssue(HttpServletRequest request, Session userSession, String issueId) throws Exception {
        return tracker.getIssue(request, userSession, issueId);
    }

    public TestCase linkIssue(HttpServletRequest request, Session userSession, String projectId, String testcaseId, String issueId) throws Exception {
        TestCase testCase = findOne(userSession, projectId, testcaseId);
        if (testCase.getIssues().stream().map(Issue::getId).filter(id -> id.equals(issueId)).count() > 0) {
            return testCase;
        }
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

    public List<Issue> suggestIssue(HttpServletRequest request, Session userSession, String issueProject, String text) throws Exception {
        return tracker.suggestIssue(request, userSession, issueProject, text);
    }

    public List<TrackerProject> suggestProjects(HttpServletRequest request, Session userSession, String projectId, String text) throws Exception {
        return tracker.suggestProjects(request, userSession, projectId, text);
    }

    public List<TrackerProject> getAllProjects(HttpServletRequest request, Session userSession, String projectId) throws Exception {
        return tracker.getAllProjects(request, userSession, projectId);
    }

    public List<IssueType> getIssueTypes(HttpServletRequest request, Session userSession, String issueProjectId) throws Exception {
        return tracker.getIssueTypes(request, userSession, issueProjectId);
    }

    public List<IssuePriority> getIssuePriorities(HttpServletRequest request, Session userSession, String issueProjectId) throws Exception {
        return tracker.getIssuePriorities(request, userSession, issueProjectId);
    }
}
