package com.testquack.dal;

import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import com.testquack.beans.Filter;
import com.testquack.beans.Order;
import com.testquack.beans.Project;

import java.util.List;

import static java.util.stream.Collectors.toList;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertThat;

public class ProjectRepositoryTest extends DalBaseTest {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectGroupRepository projectGroupRepository;

    @Autowired
    private MongoOperations mongoOperations;

    @Before
    public void setUp(){
        mongoOperations.dropCollection("projects");
    }

    @Test
    public void projectSaveTest(){
        Project project = projectRepository.save(new Project().withName("Pr1"));
        assertNotNull(project.getId());

        Project projectFetched = projectRepository.findById(project.getId()).get();
        assertNotNull(projectFetched);
        assertThat(projectFetched.getName(), is(project.getName()));
    }

    @Test
    public void findFilteredSingleFieldTest(){
        projectRepository.save(null, "projects", new Project().withName("Pr1"));
        projectRepository.save(null, "projects", new Project().withName("Pr2"));
        projectRepository.save(null, "projects", new Project().withName("Pr3"));

        List<Project> projects = projectRepository.find(
                null,
                null,
                new Filter().withField("name", "Pr2")
        );
        assertThat(projects.size(), is(1));
        assertThat(projects.get(0).getName(), is("Pr2"));
    }

    @Test
    public void findFilteredMultipleValuesFieldTest(){
        projectRepository.save(null, "projects", new Project().withName("Pr1"));
        projectRepository.save(null, "projects", new Project().withName("Pr2"));
        projectRepository.save(null, "projects", new Project().withName("Pr3"));

        List<Project> projects = projectRepository.find(
                null,
                null,
                new Filter().
                        withField("name", "Pr2").
                        withField("name", "Pr3")
        );
        assertThat(projects.size(), is(2));
        assertThat(projects.stream().map(Project::getName).collect(toList()),
                containsInAnyOrder("Pr2", "Pr3"));
    }

    @Test
    public void findFilteredMultipleFieldTest(){
        projectRepository.save(null, "projects", new Project().withName("Pr1").withCreatedBy("AAA"));
        projectRepository.save(null, "projects", new Project().withName("Pr2").withCreatedBy("AAA"));
        projectRepository.save(null, "projects", new Project().withName("Pr3").withCreatedBy("BBB"));

        List<Project> projects = projectRepository.find(
                null,
                null,
                new Filter().
                        withField("name", "Pr2").
                        withField("name", "Pr3").
                        withField("createdBy", "AAA")
        );
        assertThat(projects.size(), is(1));
        assertThat(projects.get(0).getName(), is("Pr2"));
    }

    @Test
    public void findOrderedTest(){
        projectRepository.save(null, "projects", new Project().withName("Pr1"));
        projectRepository.save(null, "projects", new Project().withName("Pr2"));
        projectRepository.save(null, "projects", new Project().withName("Pr3"));

        List<Project> projects = projectRepository.find(
                null,
                null,
                new Filter().
                        withSortField("name")
        );
        assertThat(projects.size(), is(3));
        assertThat(projects.stream().map(Project::getName).collect(toList()),
                contains("Pr1", "Pr2", "Pr3"));

        projects = projectRepository.find(
                null,
                null,
                new Filter().
                        withSortField("name").withOrder(Order.DESC)
        );
        assertThat(projects.size(), is(3));
        assertThat(projects.stream().map(Project::getName).collect(toList()),
                contains("Pr3", "Pr2", "Pr1"));
    }

    @Test
    public void findLimitedFieldsTest(){
        projectRepository.save(null, "projects", new Project().withName("Pr1").withCreatedBy("AAA"));
        List<Project> projects = projectRepository.find(
                null,
                null,
                new Filter().
                        withExcludedField("createdBy")
        );
        assertThat(projects.size(), is(1));
        assertThat(projects.get(0).getName(), is("Pr1"));
        assertNull(projects.get(0).getCreatedBy());

        projects = projectRepository.find(
                null,
                null,
                new Filter().
                        withIncludedField("createdBy")
        );
        assertThat(projects.size(), is(1));
        assertThat(projects.get(0).getCreatedBy(), is("AAA"));
        assertNull(projects.get(0).getName());
    }
}
