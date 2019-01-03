package ru.greatbit.quack.api.resources;

import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import ru.greatbit.quack.beans.Launch;
import ru.greatbit.quack.beans.LaunchStatus;
import ru.greatbit.quack.beans.LaunchTestCase;
import ru.greatbit.quack.services.BaseService;
import ru.greatbit.quack.services.LaunchService;
import ru.greatbit.whoru.jaxrs.Authenticable;

import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;

@Authenticable
@Path("/{projectId}/launch")
public class LaunchResource extends BaseCrudResource<Launch> {

    @Autowired
    private LaunchService service;

    @Override
    protected BaseService<Launch> getService() {
        return service;
    }

    @POST
    @Path("/{launchId}/{testcaseUUID}/status/{status}")
    public LaunchTestCase updateLaunchTestCaseStatus(
            @ApiParam(value = "Project Id", required = true) @PathParam("projectId") String projectId,
            @ApiParam(value = "Launch Id", required = true) @PathParam("launchId") String launchId,
            @ApiParam(value = "Launch TestCase UUID", required = true) @PathParam("testcaseUUID") String testcaseUUID,
            @ApiParam(value = "New Status", required = true) @PathParam("status") LaunchStatus status
    ){
        return service.updateLaunchTestCaseStatus(getUserSession(), projectId, launchId, testcaseUUID, status);
    }


}
