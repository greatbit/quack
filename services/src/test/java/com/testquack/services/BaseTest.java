package com.testquack.services;

import com.testquack.beans.Project;
import com.testquack.beans.TestCase;
import com.testquack.dal.ProjectRepository;
import com.testquack.dal.TestCaseRepository;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import ru.greatbit.whoru.auth.Person;
import ru.greatbit.whoru.auth.Session;

import java.util.*;

@SuppressWarnings("SpringJavaAutowiringInspection")
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:service-test-context.xml")
public abstract class BaseTest {

    @Autowired
    protected MongoTemplate mongoTemplate;

    @Autowired
    protected ProjectRepository projectRepository;

    @Autowired
    protected ProjectService projectService;

    @Autowired
    protected TestCaseService testCaseService;

    @Autowired
    protected LaunchService launchService;

    @Autowired
    protected AttributeService attributeService;

    @Autowired
    protected TestCaseRepository testCaseRepository;

    protected Project project1 = new Project().withName("Project 1").
            withId("pr1").withReadWriteGroups("1", "2").withReadWriteUsers("u1", "u2");

    protected Project project2 = new Project().withName("Project 2").
            withId("pr2").withReadWriteGroups("2", "3").withReadWriteUsers("u2", "u3");

    protected Project project3 = new Project().withName("Project 3").
            withId("pr3").withReadWriteGroups("3", "4").withReadWriteUsers("u3", "u4");

    protected Project project4 = new Project().withName("Project 4").
            withId("pr4").withReadWriteUsers("pers1", "pers2");


    protected TestCase testCase1 = (TestCase) new TestCase().withName("testcase1").
            withAlias("testcase1");

    protected TestCase testCase2 = (TestCase) new TestCase().withName("testcase2").
            withAlias("testcase2");

    protected TestCase testCase3 = (TestCase) new TestCase().withName("testcase3").
            withAlias("testcase3");

    protected TestCase testCase4NoAlias = (TestCase) new TestCase().withName("testCase4NoAlias");

    protected List<Project> projects = Arrays.asList(project1, project2, project3, project4);

    protected List<TestCase> testCasesProject1 = new ArrayList<>();
    protected List<TestCase> testCasesProject2 = new ArrayList<>();
    protected List<TestCase> testCasesProject3 = new ArrayList<>();

    protected Session adminSession = (Session) new Session().withId(UUID.randomUUID().toString()).
            withIsAdmin(true).withPerson(new Person().withId("admin").withLogin("admin"));

    protected Session userSession = (Session) new Session().withId(UUID.randomUUID().toString()).
            withIsAdmin(false).withPerson(new Person().withGroups("2", "7").withId("pers1").withLogin("pers1"));

    @Before
    public void setUp(){
        mongoTemplate.getDb().drop();

        project1 = projectService.create(adminSession, null, project1);
        project2 = projectService.create(adminSession, null, project2);
        project3 = projectService.create(adminSession, null, project3);
        project4 = projectService.create(adminSession, null, project4);

        testCasesProject1.addAll(createTestCases(project1.getId()));
        testCasesProject1.add(testCaseService.create(adminSession, project1.getId(), testCase1));
        testCasesProject1.add(testCaseService.create(adminSession, project1.getId(), testCase2));
        testCasesProject1.add(testCaseService.create(adminSession, project1.getId(), testCase3));
        testCasesProject1.add(testCaseService.create(adminSession, project1.getId(), testCase4NoAlias));

        testCasesProject2.addAll(createTestCases(project2.getId()));
        testCasesProject3.addAll(createTestCases(project3.getId()));
    }

    private Collection<? extends TestCase> createTestCases(String projectId) {
        List<TestCase> testCases = new ArrayList<>(3);
        for (int i = 0; i < 3; i++){
            testCases.add(testCaseService.create(adminSession, projectId,
                    (TestCase) new TestCase().withName(Integer.toString(i)))
            );
        }
        return testCases;
    }
}
