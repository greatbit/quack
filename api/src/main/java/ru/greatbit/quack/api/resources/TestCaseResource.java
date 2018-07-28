package ru.greatbit.quack.api.resources;

import org.springframework.beans.factory.annotation.Autowired;
import ru.greatbit.quack.beans.TestCase;
import ru.greatbit.quack.services.BaseService;
import ru.greatbit.quack.services.TestCaseService;

import javax.ws.rs.Path;

@Path("/{projectId}/testcase")
public class TestCaseResource extends BaseCrudResource<TestCase> {

    @Autowired
    private TestCaseService service;

    @Override
    protected BaseService<TestCase> getService() {
        return service;
    }


}
