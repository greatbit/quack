package ru.greatbit.quack.api.resources;

import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import ru.greatbit.quack.beans.*;
import ru.greatbit.quack.services.BaseService;
import ru.greatbit.quack.services.TestCaseService;
import ru.greatbit.whoru.jaxrs.Authenticable;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Authenticable
@Path("/{projectId}/testcase")
public class TestCaseResource extends BaseCrudResource<TestCase> {

    @Autowired
    private TestCaseService service;

    @Override
    protected BaseService<TestCase> getService() {
        return service;
    }

    @Override
    protected Filter initFilter(HttpServletRequest hsr) {
        TestcaseFilter filter = new TestcaseFilter(super.initFilter(hsr));
        if(hsr.getParameterValues("groups") != null){
            filter.getGroups().addAll(Arrays.asList(hsr.getParameterValues("groups")));
        }
        if (filter.getFields().containsKey("groups")){
            filter.getFields().remove("groups");
        }
        
        return filter;
    }

    @GET
    @Path("/tree")
    public TestCaseTree findFilteredTree(@ApiParam(value = "Project Id", required = true) @PathParam("projectId") String projectId) {
        return service.findFilteredTree(getUserSession(), projectId, (TestcaseFilter) initFilter(request));
    }

}
