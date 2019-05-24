package com.quack.services;

import com.quack.beans.FailureDetails;
import com.quack.beans.Filter;
import com.quack.beans.Issue;
import com.quack.beans.Launch;
import com.quack.beans.LaunchStatistics;
import com.quack.beans.LaunchStats;
import com.quack.beans.LaunchStatus;
import com.quack.beans.LaunchTestCase;
import com.quack.beans.LaunchTestCaseTree;
import com.quack.beans.TestCase;
import com.quack.beans.TestCaseTree;
import com.quack.beans.TestSuite;
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
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.quack.dal.impl.CommonRepositoryImpl.getCollectionName;
import static java.lang.String.format;
import static java.util.Collections.emptyMap;
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
    DBUtils dbUtils;

    @Override
    protected CommonRepository<Launch> getRepository() {
        return repository;
    }

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
        failureDetails.setCreatedBy(session.getLogin());
        failureDetails.setCreatedTime(System.currentTimeMillis());

        if (failureDetails.getLinkedIssue() != null) {
            Issue issue = failureDetails.getLinkedIssue();
            if (isEmpty(issue.getId())) {
                issue = tracker.createIssue(request, session, issue);
            } else {
                issue = tracker.linkIssue(request, session, issue.getId());
            }
            testCaseService.linkIssue(request, session, projectId, launchTestCase.getId(), issue.getId());
            failureDetails.setLinkedIssue(issue);
        }
        failureDetails.setUuid(UUID.randomUUID().toString());
        launchTestCase.getFailureDetails().add(failureDetails);
    }

    @Override
    protected void beforeCreate(Session session, String projectId, Launch launch) {
        if (launch.getTestSuite() != null && !isEmpty(launch.getTestSuite().getId())){
            fillLaunchBySuite(session, projectId, launch);
        } else if ( launch.getTestSuite() != null && launch.getTestSuite().getFilter() != null){
            fillLaunchByFilter(session, projectId, launch);
        }
        launch.setStatus(RUNNABLE);
        super.beforeCreate(session, projectId, launch);
    }

    @Override
    protected void beforeSave(Session session, String projectId, Launch launch) {
        super.beforeSave(session, projectId, launch);
        updateLaunchStatus(launch);
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
        TestCaseTree tcTree = testCaseService.findFilteredTree(session, projectId, launch.getTestSuite().getFilter());
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
}
