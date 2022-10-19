package com.testquack.services;

import com.testquack.beans.Attachment;
import com.testquack.beans.Attribute;
import com.testquack.beans.EntityPreview;
import com.testquack.beans.Event;
import com.testquack.beans.EventType;
import com.testquack.beans.Filter;
import com.testquack.beans.Issue;
import com.testquack.beans.IssuePriority;
import com.testquack.beans.IssueType;
import com.testquack.beans.Sequencer;
import com.testquack.beans.TestCase;
import com.testquack.beans.TestCasePreview;
import com.testquack.beans.TestCaseTree;
import com.testquack.beans.TestcaseFilter;
import com.testquack.beans.TrackerProject;
import com.testquack.dal.TestCasePreviewRepository;
import com.testquack.services.errors.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.testquack.dal.CommonRepository;
import com.testquack.dal.TestCaseRepository;
import com.testquack.storage.Storage;
import com.testquack.tracker.Tracker;
import ru.greatbit.whoru.auth.Session;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.stream.Collectors;

import static java.lang.String.format;
import static java.lang.String.join;
import static org.springframework.util.StringUtils.isEmpty;
import static ru.greatbit.utils.string.StringUtils.emptyIfNull;

@Service
public class TestCaseService extends BaseService<TestCase> {

    @Autowired
    private TestCaseRepository repository;

    @Autowired
    private TestCasePreviewRepository testCasePreviewRepository;

    @Autowired
    private SequencerService sequencerService;

    @Autowired
    private AttributeService attributeService;

    @Autowired
    private Storage storage;

    @Autowired
    private Tracker tracker;

    @Autowired
    private EventService eventService;

    @Override
    protected CommonRepository<TestCase> getRepository() {
        return repository;
    }

    private final String UNKNOWN_GROUP = "None";

    public TestCaseTree findFilteredTree(Session session, String projectId, TestcaseFilter filter) {
        TestCaseTree head = new TestCaseTree();
        List<TestCasePreview> testCases = userCanReadProject(session, projectId) ?
                testCasePreviewRepository.find(getCurrOrganizationId(session),projectId, filter) :
                Collections.emptyList();
        head.getTestCases().addAll(testCases.stream().map(TestCase::new).collect(Collectors.toList()));

        buildTree(head, new ArrayList<>(filter.getGroups()));
        return head;
    }

    public TestCaseTree findFilteredTreeFullCase(Session session, String projectId, TestcaseFilter filter) {
        TestCaseTree head = new TestCaseTree();
        List<TestCase> testCases = userCanReadProject(session, projectId) ?
                repository.find(getCurrOrganizationId(session), projectId, filter) :
                Collections.emptyList();
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

    private void addToMapOfList(Map<String, List<TestCase>> casesByGroupValues, String attrValue, TestCase testCase) {
        casesByGroupValues.putIfAbsent(attrValue, new ArrayList<>());
        casesByGroupValues.get(attrValue).add(testCase);
    }

    @Override
    protected void beforeCreate(Session session, String projectId, TestCase entity) {
        super.beforeCreate(session, projectId, entity);
        if (!isEmpty(entity.getAlias())){
            TestcaseFilter filter = (TestcaseFilter) new TestcaseFilter().
                    withField("alias", entity.getAlias()).
                    withField("deleted", true).
                    withField("deleted", false);
            TestCase existingEntity = findFiltered(session, projectId, filter).stream().findFirst().orElse(null);
            if (existingEntity != null){
                entity.mergeFrom(entity, existingEntity);
                entity.setDeleted(false);
            }
        }
        if (isEmpty(entity.getName()) && !isEmpty(entity.getImportedName())) {
            entity.setName(entity.getImportedName());
        }
        if (isEmpty(entity.getId())) {
            Sequencer sequencer = sequencerService.increment(getCurrOrganizationId(session), projectId);
            entity.setId(Long.toString(sequencer.getIndex()));
        }
    }

    @Override
    protected void beforeSave(Session session, String projectId, TestCase entity) {
        super.beforeSave(session, projectId, entity);
        createMissingAttributes(session, projectId, entity);
    }

    @Override
    protected void beforeUpdate(Session session, String projectId, TestCase existingEntity, TestCase entity) {
        super.beforeUpdate(session, projectId, existingEntity, entity);
        entity.setAttachments(existingEntity.getAttachments());
        if (existingEntity != null) {
            eventService.create(session, projectId,
                    new Event().withEventType(EventType.UPDATED.toString()).
                            withTime(System.currentTimeMillis()).
                            withUser(session.getLogin()).
                            withEntityId(existingEntity.getId()).
                            withEntityType(TestCase.class.getSimpleName())
            );
        }

    }

    @Override
    protected TestCase beforeReturn(Session session, String projectId, TestCase entity) {
        entity = super.beforeReturn(session, projectId, entity);
        entity.getAttachments().forEach(attachment -> {
            attachment.setUrl(null);
            attachment.setStorageType(null);
        });
        return entity;
    }

    public List<TestCase> importTestCases(Session user, String projectId, List<TestCase> testCases){
        testCases.forEach(testCase -> importTestCase(user, projectId, testCase));
        return testCases;
    }

    private void importTestCase(Session user, String projectId, TestCase testCase) {
        TestCase existingTestcase = null;
        try {
            if (!isEmpty(testCase.getId())){
                existingTestcase = findOne(user, projectId, testCase.getId());
            }
        } catch (EntityNotFoundException e){
            logger.info(format("Unable to find testcase to import by id [%s]. Will try by alias [%s]",
                    testCase.getId(), emptyIfNull(testCase.getAlias())));
        }

        if (existingTestcase == null && !isEmpty(testCase.getAlias())){
            Filter filter = (Filter) new Filter().withField("alias", testCase.getAlias()).withLimit(1);
            existingTestcase = findFiltered(user, projectId, filter).stream().findFirst().orElse(null);
        }

        if (existingTestcase == null){
            existingTestcase = testCase;
        } else {
            existingTestcase.mergeFrom(existingTestcase, testCase);
            existingTestcase.getAttributes().putAll(testCase.getAttributes());
            existingTestcase.getMetaData().putAll(testCase.getMetaData());
        }
        existingTestcase.setDeleted(false);
        save(user, projectId, existingTestcase);
    }

    private TestCase createMissingAttributes(Session session, String projectId, TestCase testCase) {
        Filter attributeFilter = new Filter().withIncludedField("id");
        List<Attribute> attributes = attributeService.findFiltered(session, projectId, attributeFilter);
        if (attributes.size() == 0) {
            return testCase;
        }

        Set<String> attributeKeys = attributes.stream().map(Attribute::getId).collect(Collectors.toSet());
        Map<String, Set<String>> newAttributes = new HashMap<>();
        testCase.getAttributes().forEach((key, value) -> {
            if (!attributeKeys.contains(key)) {
                Attribute newAttribute = attributeService.create(session, projectId,
                        new Attribute().withValues(value).withName(key)
                );
                newAttributes.put(newAttribute.getId(), value);
            } else {
                newAttributes.put(key, value);
            }
        });
        testCase.getAttributes().clear();
        testCase.getAttributes().putAll(newAttributes);
        return testCase;
    }

    public TestCase uploadAttachment(Session userSession, String projectId, String testcaseId, InputStream uploadedInputStream, String fileName, long size) throws IOException {
        Attachment attachment = storage.upload(getCurrOrganizationId(userSession), projectId, uploadedInputStream, fileName, size);
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
        TestCase testCase = findOneUnfiltered(userSession, projectId, testcaseId);
        return getAttachment(testCase, attachmentId);
    }

    public TestCase deleteAttachment(Session userSession, String projectId, String testcaseId, String attachmentId) throws IOException {
        TestCase testCase = findOneUnfiltered(userSession, projectId, testcaseId);
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

    public TestCase cloneTestCase(Session userSession, String projectId, String testcaseId){
        TestCase originalTestCase = findOne(userSession, projectId, testcaseId);

        TestCase testCaseToCreate = cleanTestCaseForDuplication(originalTestCase);
        testCaseToCreate.setName("Clone of " + originalTestCase.getName());
        return create(userSession, projectId, testCaseToCreate);
    }

    public String exportToCSV(Session session, String projectId, TestcaseFilter filter) {
        List<TestCase> testCases = userCanReadProject(session, projectId) ?
                repository.find(getCurrOrganizationId(session), projectId, filter) :
                Collections.emptyList();
        testCases.sort(Comparator.comparing(EntityPreview::getId));
        return mapTestcasesToCsv(session, projectId, testCases);
    }

    private String mapTestcasesToCsv(Session session, String projectId, List<TestCase> testCases) {
        Map<String, String> attributesWithNames = attributeService.findFiltered(session, projectId, new Filter()).stream()
                .collect(Collectors.toMap(Attribute::getId, Attribute::getName, (v1,v2)->v1, LinkedHashMap::new));
        String header = buildCsvHeader(attributesWithNames);
        String testcasesCsv = buildTestcasesCsv(testCases, attributesWithNames);
        return header + "\n" + testcasesCsv;
    }

    private String buildTestcasesCsv(List<TestCase> testCases, Map<String, String> attributesWithNames) {
        return testCases.stream().map(testCase -> buildTestcaseCsv(testCase, attributesWithNames))
                .collect(Collectors.joining("\n"));
    }

    private String buildTestcaseCsv(TestCase testCase, Map<String, String> attributesWithNames) {
        return testCase.getId() + "," + wrapCsvLine(testCase.getName()) + "," + getTestcaseAttributesCsv(testCase, attributesWithNames);
    }

    private String getTestcaseAttributesCsv(TestCase testCase, Map<String, String> attributesWithNames) {
        return attributesWithNames.keySet().stream()
                .map(attributeKey -> getTestcaseAttributeValuesInCSV(testCase, attributeKey))
                .map(this::wrapCsvLine)
                .collect(Collectors.joining(","));
    }

    private String getTestcaseAttributeValuesInCSV(TestCase testCase, String attributeKey){
        Set<String> values = testCase.getAttributes().getOrDefault(attributeKey, Collections.emptySet());
        return String.join(",", values);

    }

    private String wrapCsvLine(String csvLine){
        return "\"" + csvLine + "\"";
    }

    private String buildCsvHeader(Map<String, String> attributesWithNames) {
        return "Id,Name," +
                attributesWithNames.values().stream().map(this::wrapCsvLine).collect(Collectors.joining(","));
    }


    private TestCase cleanTestCaseForDuplication(TestCase originalTestCase){
        TestCase copyTestCase = (TestCase) originalTestCase.copyTo(new TestCase());
        long now = System.currentTimeMillis();
        copyTestCase.setId(null);
        copyTestCase.getAttachments().clear();
        copyTestCase.setCreatedBy(null);
        copyTestCase.setCreatedTime(now);

        copyTestCase.getIssues().clear();
        copyTestCase.setLastModifiedBy(null);
        copyTestCase.setLastModifiedTime(now);
        copyTestCase.getAttributes().putAll(originalTestCase.getAttributes());
        return copyTestCase;
    }
}
