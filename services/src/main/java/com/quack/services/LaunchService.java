package com.quack.services;

import com.quack.beans.Launch;
import com.quack.beans.LaunchStats;
import com.quack.beans.LaunchStatus;
import com.quack.beans.LaunchTestCase;
import com.quack.beans.LaunchTestCaseTree;
import com.quack.beans.TestCaseTree;
import com.quack.beans.TestSuite;
import com.quack.services.errors.EntityAccessDeniedException;
import com.quack.services.errors.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.quack.dal.CommonRepository;
import com.quack.dal.LaunchRepository;
import ru.greatbit.whoru.auth.Session;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import static java.lang.String.format;
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

    @Override
    protected CommonRepository<Launch> getRepository() {
        return repository;
    }

    public LaunchTestCase updateLaunchTestCaseStatus(Session session, String projectId,
                                                     String launchId, String testCaseUUID,
                                                     LaunchStatus status){
        Launch launch = findOne(session, projectId, launchId);
        LaunchTestCase launchTestCase = findLaunchTestCaseInTree(launch.getTestCaseTree(), testCaseUUID);
        if (launchTestCase == null){
            throw new EntityNotFoundException(
                    format("Launch Test Case with UUID %s not found in Launch with id %s", testCaseUUID, launchId)
            );
        }
        updateStatus(session.getPerson().getId(), launchTestCase, status);
        update(session, projectId, launch);
        return launchTestCase;
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
            launchTestCaseTree.setUuid(tcTree.getId());
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
}
