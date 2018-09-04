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

        if (hsr.getParameterValues("attribute") != null){
            Map<String, Set<String>> attributes = new HashMap<>();
            Stream.of(hsr.getParameterValues("attribute")).forEach(param -> {
                String id = param.split(":")[0];
                String value = param.split(":")[1];
                attributes.putIfAbsent(id, new HashSet<>());
                attributes.get(id).add(value);
            });
            List<Attribute> attributesToFilter = attributes.entrySet().stream().
                    map(entry -> new Attribute().withId(entry.getKey()).withValues(entry.getValue())).
                    collect(Collectors.toList());
            filter.getFilters().addAll(attributesToFilter);
        }

        return filter;
    }

    @GET
    @Path("/tree")
    public TestCaseTree findFilteredTree(@ApiParam(value = "Project Id", required = true) @PathParam("projectId") String projectId) {
        return service.findFilteredTree(getUserSession(), projectId, (TestcaseFilter) initFilter(request));
    }

}
