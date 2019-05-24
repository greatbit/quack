package com.quack.api.resources;

import com.quack.beans.FailureDetails;
import com.quack.beans.Launch;
import com.quack.beans.LaunchStatistics;
import com.quack.beans.LaunchStatus;
import com.quack.beans.LaunchTestCase;
import com.quack.services.BaseService;
import com.quack.services.LaunchService;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import retrofit2.http.Body;
import ru.greatbit.whoru.jaxrs.Authenticable;

import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Response;
import java.util.Map;

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
            @ApiParam(value = "New Status", required = true) @PathParam("status") LaunchStatus status,
            @Body FailureDetails failureDetails) throws Exception {
        return service.updateLaunchTestCaseStatus(request, getUserSession(), projectId, launchId, testcaseUUID, status, failureDetails);
    }

    @GET
    @Path("/statistics")
    public Map<String, LaunchStatistics> getLaunchesStatistics(@ApiParam(value = "Project Id", required = true) @PathParam("projectId") String projectId) throws Exception {
        return service.getLaunchesStatistics(getUserSession(), projectId, initFilter(request));
    }

}
