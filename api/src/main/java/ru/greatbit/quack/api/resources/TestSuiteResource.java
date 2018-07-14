package ru.greatbit.quack.api.resources;

import org.springframework.beans.factory.annotation.Autowired;
import ru.greatbit.quack.beans.TestSuite;
import ru.greatbit.quack.services.BaseService;
import ru.greatbit.quack.services.TestSuiteService;

import javax.ws.rs.Path;

@Path("/testsuite")
public abstract class TestSuiteResource extends BaseCrudResource<TestSuite> {

    @Autowired
    private TestSuiteService service;

    @Override
    protected BaseService<TestSuite> getService() {
        return service;
    }


}
