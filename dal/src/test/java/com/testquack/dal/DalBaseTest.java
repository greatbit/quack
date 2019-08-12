package com.testquack.dal;

import com.testquack.beans.Project;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:quack-test-context.xml"})
public abstract class DalBaseTest {

    @Autowired
    protected ProjectRepository projectRepository;

    @Autowired
    protected TestCaseRepository testCaseRepository;

    @Autowired
    protected MongoOperations mongoOperations;

    @Autowired
    protected MongoTemplate mongoTemplate;

    protected Project project1;
    protected Project project2;

    @Before
    public void setUp() {
        mongoTemplate.getDb().drop();
        project1 = projectRepository.save(new Project().withName("Pr1"));
        project2 = projectRepository.save(new Project().withName("Pr2"));
    }

}
