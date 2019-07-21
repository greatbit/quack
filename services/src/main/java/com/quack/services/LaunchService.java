package com.quack.services;

import com.quack.beans.Comment;
import com.quack.beans.FailureDetails;
import com.quack.beans.Filter;
import com.quack.beans.Issue;
import com.quack.beans.Launch;
import com.quack.beans.LaunchStatistics;
import com.quack.beans.LaunchStats;
import com.quack.beans.LaunchStatus;
import com.quack.beans.LaunchTestCase;
import com.quack.beans.LaunchTestCaseTree;
import com.quack.beans.TestCaseTree;
import com.quack.beans.TestSuite;
import com.quack.beans.TestcaseFilter;
import com.quack.dal.impl.DBUtils;
import com.quack.services.errors.EntityAccessDeniedException;
import com.quack.services.errors.EntityNotFoundException;
import com.quack.tracker.Tracker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.quack.dal.CommonRepository;
import com.quack.dal.LaunchRepository;
import ru.greatbit.whoru.auth.Session;

import javax.servlet.http.HttpServletRequest;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static com.quack.dal.impl.CommonRepositoryImpl.getCollectionName;
import static java.lang.String.format;
import static java.util.Collections.emptyMap;
import static java.util.stream.Collectors.toSet;
import static org.springframework.util.StringUtils.isEmpty;
import static com.quack.beans.LaunchStatus.*;
import static ru.greatbit.utils.string.StringUtils.emptyIfNull;

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
        Launch launch = findOne(session, projectId, launchId);
        LaunchTestCase launchTestCase = findLaunchTestCaseInTree(launch.getTestCaseTree(), testCaseUUID);
        if (launchTestCase == null){
            throw new EntityNotFoundException(
                    format("Launch Test Case with UUID %s not found in Launch with id %s", testCaseUUID, launchId)
            );
        }
        if (isFailedStatus(status) && isFailureDetailsValid(failureDetails)) {
            addFailureDetails(request, session, projectId, launchTestCase, failureDetails);
        }
        updateStatus(session.getPerson().getId(), launchTestCase, status);
        update(session, projectId, launch);
        return launchTestCase;
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
        Comment comment = new Comment().withEntityId(launchTestCase.getUuid()).withEntityType(FAILURE_DETAILS_TYPE).withText(failureDetails.getText());
        commentService.save(session, projectId, comment);
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
        launch.setStatus(RUNNABLE);
        super.beforeCreate(session, projectId, launch);
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
        TestCaseTree tcTree = testCaseService.findFilteredTree(session, projectId, filter);
        launch.setTestCaseTree(convertToLaunchTestCases(tcTree));
        return launch;
    }

    private LaunchTestCaseTree convertToLaunchTestCases(TestCaseTree tcTree){
        List<LaunchTestCase> launchTestCases = tcTree.getTestCases().stream().map(testCase ->
                {
                    LaunchTestCase launchTestCase = new LaunchTestCase();
                    testCase.copyTo(launchTestCase);
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
        LaunchStatus currentStatus = launchTestCase.getLaunchStatus();
        if (currentStatus.equals(RUNNING) &&
                !emptyIfNull(launchTestCase.getCurrentUser()).equals(userId) &&
                !status.equals(RUNNABLE)){
            throw new EntityAccessDeniedException(
                    format("Test Case with UUID %s is being executed by user %s", launchTestCase.getUuid(), launchTestCase.getCurrentUser())
            );
        } else {
            if (status.equals(RUNNING)){
                launchTestCase.setCurrentUser(userId);
            }
            launchTestCase.setLaunchStatus(status);
        }
        if (!launchTestCase.getUsers().contains(userId)){
            launchTestCase.getUsers().add(userId);
        }
    }

    public Map<String, LaunchStatistics> getLaunchesStatistics(Session session, String projectId, Filter filter) throws Exception {
        if (userCanReadProject(session, projectId)) {
            return dbUtils.mapReduce(getCollectionName(projectId, Launch.class),
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
}
