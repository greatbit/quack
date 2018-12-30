package ru.greatbit.quack.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.greatbit.quack.beans.*;
import ru.greatbit.quack.dal.CommonRepository;
import ru.greatbit.quack.dal.LaunchRepository;
import ru.greatbit.whoru.auth.Session;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static org.springframework.util.StringUtils.isEmpty;

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

    @Override
    protected void beforeCreate(Session session, String projectId, Launch launch) {
        if (launch.getTestSuite() != null && !isEmpty(launch.getTestSuite().getId())){
            fillLaunchBySuite(launch);
        } else if ( launch.getTestSuite() != null && launch.getTestSuite().getFilter() != null){
            fillLaunchByFilter(session, projectId, launch);
        }
        launch.setStatus(LaunchStatus.RUNNABLE);
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
                            withLaunchStatus(LaunchStatus.RUNNABLE);

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
}
