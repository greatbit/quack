package ru.greatbit.quack.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.greatbit.quack.beans.*;
import ru.greatbit.quack.dal.CommonRepository;
import ru.greatbit.quack.dal.LaunchRepository;
import ru.greatbit.quack.services.errors.EntityAccessDeniedException;
import ru.greatbit.quack.services.errors.EntityNotFoundException;
import ru.greatbit.whoru.auth.Session;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static java.lang.String.format;
import static org.springframework.util.StringUtils.isEmpty;
import static ru.greatbit.quack.beans.LaunchStatus.RUNNABLE;
import static ru.greatbit.quack.beans.LaunchStatus.RUNNING;
import static ru.greatbit.utils.string.StringUtils.emptyIfNull;

@Service
public class LaunchService extends BaseService<Launch> {

    @Autowired
    private LaunchRepository repository;

    @Autowired
    private TestCaseService testCaseService;

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
            fillLaunchBySuite(launch);
        } else if ( launch.getTestSuite() != null && launch.getTestSuite().getFilter() != null){
            fillLaunchByFilter(session, projectId, launch);
        }
        launch.setStatus(RUNNABLE);
        super.beforeCreate(session, projectId, launch);
    }

    private void fillLaunchByFilter(Session session, String projectId, Launch launch) {
        TestCaseTree tcTree = testCaseService.findFilteredTree(session, projectId, (TestcaseFilter) launch.getTestSuite().getFilter());
        launch.setTestCaseTree(convertToLaunchTestCases(tcTree));
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

    private void fillLaunchBySuite(Launch launch) {

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
