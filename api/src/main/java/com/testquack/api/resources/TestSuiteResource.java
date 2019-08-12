package com.testquack.api.resources;

import com.testquack.beans.TestSuite;
import com.testquack.services.BaseService;
import com.testquack.services.TestSuiteService;
import org.springframework.beans.factory.annotation.Autowired;
import ru.greatbit.whoru.jaxrs.Authenticable;

import javax.ws.rs.Path;

@Authenticable
@Path("/{projectId}/testsuite")
public class TestSuiteResource extends BaseCrudResource<TestSuite> {

    @Autowired
    private TestSuiteService service;

    @Override
    protected BaseService<TestSuite> getService() {
        return service;
    }


}
