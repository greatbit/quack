package ru.greatbit.quack.dal;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import ru.greatbit.quack.beans.Project;

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
}
