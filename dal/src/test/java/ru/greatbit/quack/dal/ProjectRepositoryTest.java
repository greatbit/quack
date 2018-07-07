package ru.greatbit.quack.dal;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import ru.greatbit.quack.beans.Filter;
import ru.greatbit.quack.beans.Project;

import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertThat;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath*:quack-test-context.xml"})
public class ProjectRepositoryTest {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectGroupRepository projectGroupRepository;

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
        projectRepository.save("projects", new Project().withName("Pr1"));
        projectRepository.save("projects", new Project().withName("Pr2"));
        projectRepository.save("projects", new Project().withName("Pr3"));

        List<Project> projects = projectRepository.find(
                null,
                new Filter().withField("name", "Pr2"),
                0, 0
        );
        assertThat(projects.size(), is(1));
        assertThat(projects.get(0).getName(), is("Pr2"));
    }
}
