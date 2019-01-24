package ru.greatbit.quack.services;

import org.junit.Before;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import ru.greatbit.quack.beans.Filter;
import ru.greatbit.quack.beans.Project;
import ru.greatbit.quack.dal.ProjectRepository;
import ru.greatbit.quack.dal.TestCaseRepository;
import ru.greatbit.whoru.auth.Person;
import ru.greatbit.whoru.auth.Session;

import java.util.UUID;

@SuppressWarnings("SpringJavaAutowiringInspection")
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:service-test-context.xml")
public class BaseTest {

    @Autowired
    protected MongoOperations mongoOperations;

    @Autowired
    protected ProjectRepository projectRepository;

    @Autowired
    protected ProjectService projectService;

    @Autowired
    protected TestCaseService testCaseService;

    @Autowired
    protected TestCaseRepository testCaseRepository;

    protected Project project1 = new Project().withName("Project 1").
            withId("pr1").withAllowedGroups("1", "2");

    protected Project project2 = new Project().withName("Project 2").
            withId("pr2").withAllowedGroups("2", "3");

    protected Project project3 = new Project().withName("Project 3").
            withId("pr3").withAllowedGroups("3", "4");

    protected Session adminSession = new Session().withId(UUID.randomUUID().toString()).
            withIsAdmin(true).withPerson(new Person().withId("admin"));

    protected Session userSession = new Session().withId(UUID.randomUUID().toString()).
            withIsAdmin(false).withGroups("2", "7").
            withPerson(new Person().withGroups("2", "7").withId("pers1"));

    @Before
    public void setUp(){
        mongoOperations.remove(new Query(), "projects");

        project1 = projectService.create(adminSession, null, project1);
        project2 = projectService.create(adminSession, null, project2);
        project3 = projectService.create(adminSession, null, project3);

    }
}
