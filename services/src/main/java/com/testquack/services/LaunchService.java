package com.testquack.services;

import com.google.common.collect.MinMaxPriorityQueue;
import com.hazelcast.cp.lock.FencedLock;
import com.testquack.beans.Event;
import com.testquack.beans.FailureDetails;
import com.testquack.beans.Filter;
import com.testquack.beans.Issue;
import com.testquack.beans.Launch;
import com.testquack.beans.LaunchStatistics;
import com.testquack.beans.LaunchStats;
import com.testquack.beans.LaunchStatus;
import com.testquack.beans.LaunchTestCase;
import com.testquack.beans.LaunchTestCaseTree;
import com.testquack.beans.LaunchTestcaseStats;
import com.testquack.beans.TestCase;
import com.testquack.beans.TestCaseTree;
import com.testquack.beans.TestSuite;
import com.testquack.beans.TestcaseFilter;
import com.testquack.dal.impl.DBUtils;
import com.testquack.services.errors.EntityNotFoundException;
import com.testquack.tracker.Tracker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.testquack.dal.CommonRepository;
import com.testquack.dal.LaunchRepository;
import ru.greatbit.whoru.auth.Session;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static com.testquack.dal.impl.CommonRepositoryImpl.getCollectionName;
import static java.lang.String.format;
import static java.util.Collections.emptyList;
import static java.util.Collections.emptyMap;
import static java.util.stream.Collectors.toMap;
import static java.util.stream.Collectors.toSet;
import static org.springframework.util.StringUtils.isEmpty;
import static com.testquack.beans.LaunchStatus.*;

@Service
public class LaunchService extends BaseService<Launch> {

    @Autowired
    private LaunchRepository repository;

    @Autowired
    private TestCaseService testCaseService;

    @Autowired
    private TestSuiteService testSuiteSerbice;

    @Autowired
    private Tracker tracker;

    @Autowired
    private CommentService commentService;

    @Autowired
    private EventService eventService;

    @Autowired
    DBUtils dbUtils;

    private final String FAILURE_DETAILS_TYPE = "failureDetails";

    @Override
    protected CommonRepository<Launch> getRepository() {
        return repository;
    }

    private final static Set<LaunchStatus> NON_FAILED_STATUSES = Stream.of(RUNNING, RUNNABLE, SKIPPED, PASSED).collect(toSet());

    public LaunchTestCase updateLaunchTestCaseStatus(HttpServletRequest request,
                                                     Session session, String projectId,
                                                     String launchId, String testCaseUUID,
                                                     LaunchStatus status, FailureDetails failureDetails) throws Exception {
        FencedLock lock = hazelcastInstance.getCPSubsystem().getLock(Launch.class + launchId + "updateLaunchTestCaseStatus");
        try{
            lock.tryLock(lockTtl, TimeUnit.MINUTES);
            Launch launch = findOne(session, projectId, launchId);
            LaunchTestCase launchTestCase = findLaunchTestCaseInTree(launch.getTestCaseTree(), testCaseUUID);
            if (launchTestCase == null){
                throw new EntityNotFoundException(
                        format("Launch Test Case with UUID %s not found in Launch with id %s", testCaseUUID, launchId)
                );
            }
            if (isFailedStatus(status) && failureDetails != null && isFailureDetailsValid(failureDetails)) {
                launchTestCase.setFailureDetails(failureDetails);
                addFailureDetails(request, session, projectId, launchTestCase, failureDetails);
            }
            updateStatus(session.getPerson().getLogin(), launchTestCase, status);
            update(session, projectId, launch);

            //Emit audit on terminal status
            if (isTerminalStatus(status)) {
                eventService.create(session, projectId,
                        new Event().withEventType(status.toString()).
                                withTime(System.currentTimeMillis()).
                                withUser(session.getLogin()).
                                withEntityId(launchTestCase.getId()).
                                withEntityType(TestCase.class.getSimpleName())
                );
            }
            return launchTestCase;
        } finally {
            lock.unlock();
        }

    }

    private boolean isTerminalStatus(LaunchStatus status) {
        return status != RUNNABLE && status != RUNNING;
    }

    private boolean isFailureDetailsValid(FailureDetails failureDetails) {
        Issue issue = failureDetails.getLinkedIssue();
        return !isEmpty(failureDetails.getText()) ||
                (issue != null &&
                        (!isEmpty(issue.getId()) || !isEmpty(issue.getName()))
                );
    }

    private boolean isFailedStatus(LaunchStatus status) {
        return status.equals(FAILED) || status.equals(BROKEN) || status.equals(SKIPPED);
    }

    private void addFailureDetails(HttpServletRequest request, Session session, String projectId, LaunchTestCase launchTestCase, FailureDetails failureDetails) throws Exception {
        if (failureDetails.getLinkedIssue() != null) {
            Issue issue = failureDetails.getLinkedIssue();
            if (isEmpty(issue.getId())) {
                issue = tracker.createIssue(request, session, issue);
            } else {
                issue = tracker.linkIssue(request, session, issue.getId());
            }
            testCaseService.linkIssue(request, session, projectId, launchTestCase.getId(), issue.getId());
        }
    }

    @Override
    protected void beforeCreate(Session session, String projectId, Launch launch) {
        if (isLaunchTescasesTreeEmpty(launch)) {
            fillLaunchTestCases(session, projectId, launch);
        }
        fillById(session, projectId, launch);
        fillByAliases(session, projectId, launch);
        launch.setStatus(RUNNABLE);
        removeTestcasesWithNullId(launch.getTestCaseTree());
        prepareLaunchTestCasesForCreate(launch.getTestCaseTree(), launch);
        super.beforeCreate(session, projectId, launch);
    }

    private void prepareLaunchTestCasesForCreate(LaunchTestCaseTree testCaseTree, Launch launch) {
        testCaseTree.getTestCases().forEach(testcase -> prepareLaunchTestCaseForCreate(testcase, launch));
        testCaseTree.getChildren().forEach(child -> prepareLaunchTestCasesForCreate(child, launch));
    }

    private void prepareLaunchTestCaseForCreate(LaunchTestCase launchTestCase, Launch launch) {
        if (isEmpty(launchTestCase.getUuid())) {
            launchTestCase.setUuid(UUID.randomUUID().toString());
        }
        if (launch.isSkipBroken() && launchTestCase.isBroken()) {
            launchTestCase.setLaunchStatus(SKIPPED);
        }
    }

    @Override
    protected void beforeSave(Session session, String projectId, Launch launch) {
        super.beforeSave(session, projectId, launch);
        updateLaunchStatus(launch);
    }

    private boolean isLaunchTescasesTreeEmpty(Launch launch) {
        return launch.getTestCaseTree() == null ||
                (launch.getTestCaseTree().getChildren().isEmpty() && launch.getTestCaseTree().getTestCases().isEmpty());
    }

    private void fillLaunchTestCases(Session session, String projectId, Launch launch) {
        if (launch.getTestSuite() != null && !isEmpty(launch.getTestSuite().getId())) {
            fillLaunchBySuite(session, projectId, launch);
        } else if (launch.getTestSuite() != null && launch.getTestSuite().getFilter() != null) {
            fillLaunchByFilter(session, projectId, launch);
        }
    }

    private void updateLaunchStatus(Launch launch) {
        launch.setLaunchStats(new LaunchStats());
        updateLaunchStatus(launch.getLaunchStats(), launch.getTestCaseTree());
        if (isLaunchFinished(launch) && launch.getFinishTime() == 0){
            launch.setFinishTime(System.currentTimeMillis());
        }
        if (!isLaunchFinished(launch) &&
                launch.getLaunchStats().getStatusCounters().getOrDefault(RUNNABLE, 0) != launch.getLaunchStats().getTotal() &&
                launch.getStartTime() == 0){
            launch.setStartTime(System.currentTimeMillis());
        }
    }

    private boolean isLaunchFinished(Launch launch) {
        Map<LaunchStatus, Integer> statusCounters = launch.getLaunchStats().getStatusCounters();
        return launch.getLaunchStats().getTotal() == statusCounters.get(PASSED) +
                statusCounters.get(FAILED) + statusCounters.get(BROKEN) + statusCounters.get(SKIPPED);
    }

    private void updateLaunchStatus(LaunchStats launchStats, LaunchTestCaseTree testCaseTree) {
        updateLaunchStatus(launchStats, testCaseTree.getTestCases());
        testCaseTree.getChildren().forEach(child -> updateLaunchStatus(launchStats, child));
    }

    private void updateLaunchStatus(LaunchStats launchStats, List<LaunchTestCase> testCases) {
        testCases.forEach(testCase -> {
            launchStats.setTotal(launchStats.getTotal() + 1);
            int counter = launchStats.getStatusCounters().get(testCase.getLaunchStatus());
            launchStats.getStatusCounters().put(testCase.getLaunchStatus(), counter+1);
        });
    }

    private Launch fillLaunchByFilter(Session session, String projectId, Launch launch) {
        TestcaseFilter filter = (TestcaseFilter) launch.getTestSuite().getFilter().withSkip(0).withLimit(0);
        filter.getExcludedFields().clear();
        filter.getIncludedFields().clear();
        filter.withField("deleted", false);
        TestCaseTree tcTree = testCaseService.findFilteredTreeFullCase(session, projectId, filter);
        launch.setTestCaseTree(convertToLaunchTestCases(tcTree));
        return launch;
    }

    private LaunchTestCaseTree convertToLaunchTestCases(TestCaseTree tcTree){
        List<LaunchTestCase> launchTestCases = tcTree.getTestCases().stream().map(testCase ->
                {
                    LaunchTestCase launchTestCase = new LaunchTestCase();
                    testCase.copyTo(launchTestCase);
                    launchTestCase.getAttributes().putAll(testCase.getAttributes());
                    return launchTestCase.withUuid(UUID.randomUUID().toString()).
                            withLaunchStatus(RUNNABLE);

                }
        ).collect(Collectors.toList());
        LaunchTestCaseTree launchTestCaseTree = new LaunchTestCaseTree();
        launchTestCaseTree.getTestCases().addAll(launchTestCases);
        launchTestCaseTree.getChildren().addAll(
                tcTree.getChildren().stream().map(this::convertToLaunchTestCases).
                        collect(Collectors.toList())
        );
        launchTestCaseTree.setTitle(tcTree.getTitle());
        launchTestCaseTree.setId(tcTree.getId());
        if (!tcTree.isIsLeaf()){
            launchTestCaseTree.setUuid(tcTree.getId() + ":" + UUID.randomUUID().toString());
        }
        launchTestCaseTree.setCount(tcTree.getCount());
        launchTestCaseTree.setIsLeaf(tcTree.isIsLeaf());
        return launchTestCaseTree;
    }

    private Launch fillLaunchBySuite(Session session, String projectId, Launch launch) {
        if (launch.getTestSuite() == null || launch.getTestSuite().getId() == null) {
            return launch;
        }
        TestSuite testSuite = testSuiteSerbice.findOne(session, projectId, launch.getTestSuite().getId());
        if (testSuite == null) {
            return launch;
        }
        launch.setTestSuite(testSuite);
        return fillLaunchByFilter(session, projectId, launch);
    }

    private LaunchTestCase findLaunchTestCaseInTree(LaunchTestCaseTree tree, String uuid){
        LaunchTestCase testCase = tree.getTestCases().stream().
                filter(testcase -> testcase.getUuid().equals(uuid)).
                findFirst().orElse(null);
        if (testCase == null){
            for (LaunchTestCaseTree child : tree.getChildren()) {
                testCase = findLaunchTestCaseInTree(child, uuid);
                if (testCase != null) {
                    return testCase;
                }
            }
        }
        return testCase;
    }

    private void updateStatus(String userId, LaunchTestCase launchTestCase, LaunchStatus status) {
        if (status.equals(RUNNING)){
            launchTestCase.setCurrentUser(userId);
        }
        launchTestCase.setLaunchStatus(status);
        if (!launchTestCase.getUsers().contains(userId)){
            launchTestCase.getUsers().add(userId);
        }
    }

    public Map<String, LaunchStatistics> getLaunchesStatistics(Session session, String projectId, Filter filter) throws Exception {
        if (userCanReadProject(session, projectId)) {
            return dbUtils.mapReduce(Launch.class, getCollectionName(getCurrOrganizationId(session), projectId, Launch.class),
                    "launchStatsMap.js", "launchStatsReduce.js", filter, LaunchStatistics.class);
        }
        return emptyMap();
    }

    public Launch cleanLaunchForRestart(Session session, String projectId, Launch launch, boolean failedOnly) {
        Launch sourceLaunch = findOne(session, projectId, launch.getId());
        launch.setTestCaseTree(sourceLaunch.getTestCaseTree());
        cleanUpLaunchForRestart(launch, failedOnly);
        return launch;
    }

    public Collection<LaunchTestcaseStats> getTestCasesHeatMap(Session session, String projectId, Filter filter, int statsTopLimit) throws Exception {
        statsTopLimit = statsTopLimit == 0 ? 100 : statsTopLimit;
        if (userCanReadProject(session, projectId)) {
            Map<String, LaunchTestcaseStats> unsortedMap = dbUtils.mapReduce(Launch.class, getCollectionName(getCurrOrganizationId(session), projectId, Launch.class),
                    "testcaseHeatMap.js", "testcaseHeatReduce.js", filter, LaunchTestcaseStats.class);

            MinMaxPriorityQueue<LaunchTestcaseStats> topStats = MinMaxPriorityQueue.
                    orderedBy(new LaunchTestcaseStatsComparator()).
                    maximumSize(statsTopLimit).
                    create();
            topStats.addAll(unsortedMap.values());

            Map<String, LaunchTestcaseStats> statsMap =
                    topStats.stream().collect(toMap(LaunchTestcaseStats::getId, Function.identity()));

            //Get current broken flag state
            List<TestCase> actualTestcases = testCaseService.findFiltered(session, projectId,
                    new TestcaseFilter().withIncludedField("id").
                            withIncludedField("name").
                            withIncludedField("broken").
                            withIncludedField("importedName").
                            withField("id", statsMap.keySet().toArray()));
            actualTestcases.forEach(actualTestcase -> {
                LaunchTestcaseStats statsToUpdate = statsMap.get(actualTestcase.getId());
                statsToUpdate.setBroken(actualTestcase.isBroken());
                statsToUpdate.setName(
                        isEmpty(actualTestcase.getName()) ?
                                actualTestcase.getImportedName() : actualTestcase.getName());
            });

            //Sort stats by most broken
            List<LaunchTestcaseStats> sortedStats = new ArrayList<>(topStats.size());
            sortedStats.addAll(topStats);
            sortedStats.sort(new LaunchTestcaseStatsComparator());
            return sortedStats;
        }
        return emptyList();
    }

    private void cleanUpLaunchForRestart(Launch launch, boolean failedOnly) {
        launch.withId(null).withCreatedBy(null).withCreatedTime(0).withFinishTime(0).withLastModifiedBy(null).withLastModifiedTime(0).withStatus(RUNNABLE);
        launch.setLaunchStats(null);
        cleanUpLaunchesTestCases(launch.getTestCaseTree(), failedOnly);
    }

    private LaunchTestCaseTree cleanUpLaunchesTestCases(LaunchTestCaseTree testCaseTree, boolean failedOnly) {
        List<LaunchTestCase> newTopLevelLaunchTestCases = testCaseTree.getTestCases().stream().
                filter(launchTestCase -> !failedOnly || isFailedState(launchTestCase.getLaunchStatus())).
                map(launchTestCase -> cleanUpLauncheTestCase(launchTestCase)).
                collect(Collectors.toList());
        testCaseTree.setTestCases(newTopLevelLaunchTestCases);

        List<LaunchTestCaseTree> newChildren = testCaseTree.getChildren().stream().
                map(child -> cleanUpLaunchesTestCases(child, failedOnly)).
                filter(child -> !child.getTestCases().isEmpty() || !child.getChildren().isEmpty()).
                collect(Collectors.toList());
        testCaseTree.setChildren(newChildren);

        return testCaseTree;

    }

    private LaunchTestCase cleanUpLauncheTestCase(LaunchTestCase launchTestCase) {
        launchTestCase.getUsers().clear();
        launchTestCase.withDuration(0).withCurrentUser(null).withFinishTime(0).withStartTime(0).
                withLaunchStatus(RUNNABLE).withUuid(UUID.randomUUID().toString());
        return launchTestCase;
    }


    private boolean isFailedState(LaunchStatus launchStatus) {
        return !NON_FAILED_STATUSES.contains(launchStatus);
    }

    private void fillById(Session session, String projectId, Launch launch) {
        Map<String, LaunchTestCase> testcasesToFill = new HashMap<>();
        getTestcasesToFillById(launch.getTestCaseTree(), testcasesToFill);
        fillByFeld(session, projectId, "id", testcasesToFill);
    }

    private void fillByAliases(Session session, String projectId, Launch launch) {
        Map<String, LaunchTestCase> testcasesToFill = new HashMap<>();
        getTestcasesToFillByAliases(launch.getTestCaseTree(), testcasesToFill);
        fillByFeld(session, projectId, "alias", testcasesToFill);
    }

    private void fillByFeld(Session session, String projectId, String fieldName, Map<String, LaunchTestCase> testcasesToFill) {
        TestcaseFilter filter = (TestcaseFilter) new TestcaseFilter().
                withField(fieldName, testcasesToFill.keySet().toArray());
        List<TestCase> originalTestCases = testCaseService.findFiltered(session, projectId, filter);
        originalTestCases.forEach(originalTestCase -> fillOriginalTestcase(originalTestCase, testcasesToFill));
    }

    private void fillOriginalTestcase(TestCase originalTestCase, Map<String, LaunchTestCase> testcasesToFill) {
        LaunchTestCase testcaseToUpdate = testcasesToFill.getOrDefault(
                originalTestCase.getAlias(),
                testcasesToFill.get(originalTestCase.getId()));
        if (testcaseToUpdate == null) {
            return;
        }
        originalTestCase.copyTo(testcaseToUpdate);
        testcaseToUpdate.getAttributes().putAll(originalTestCase.getAttributes());
        testcaseToUpdate.getMetaData().putAll(originalTestCase.getMetaData());
    }

    private void getTestcasesToFillByAliases(LaunchTestCaseTree tree, Map<String, LaunchTestCase> casesToUpdate) {
        tree.getTestCases().stream().
                filter(testcase -> testcase.getId() == null).
                forEach(testcase -> casesToUpdate.put(testcase.getAlias(), testcase));
        tree.getChildren().forEach(child -> getTestcasesToFillByAliases(child, casesToUpdate));
    }

    private void getTestcasesToFillById(LaunchTestCaseTree tree, Map<String, LaunchTestCase> casesToUpdate) {
        tree.getTestCases().stream().
                filter(testcase -> testcase.getId() != null).
                forEach(testcase -> casesToUpdate.put(testcase.getId(), testcase));
        tree.getChildren().forEach(child -> getTestcasesToFillByAliases(child, casesToUpdate));
    }

    private void removeTestcasesWithNullId(LaunchTestCaseTree tree) {
        tree.setTestCases(
                tree.getTestCases().stream().
                        filter(testCase -> testCase.getId() != null).
                        collect(Collectors.toList())
        );
        tree.getChildren().forEach(this::removeTestcasesWithNullId);
    }
}
