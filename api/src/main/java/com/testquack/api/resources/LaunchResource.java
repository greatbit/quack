package com.testquack.api.resources;

import com.testquack.beans.FailureDetails;
import com.testquack.beans.Launch;
import com.testquack.beans.LaunchStatistics;
import com.testquack.beans.LaunchStatus;
import com.testquack.beans.LaunchTestCase;
import com.testquack.beans.LaunchTestcaseStats;
import com.testquack.beans.TestSuite;
import com.testquack.beans.TestcaseFilter;
import com.testquack.launcher.Launcher;
import com.testquack.services.BaseService;
import com.testquack.services.LaunchService;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import ru.greatbit.plow.PluginsContainer;
import ru.greatbit.whoru.jaxrs.Authenticable;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.QueryParam;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import static java.lang.String.format;
import static org.apache.commons.lang3.StringUtils.isEmpty;

@Authenticable
@Path("/{projectId}/launch")
public class LaunchResource extends BaseCrudResource<Launch> {

    @Autowired
    private LaunchService service;

    @Autowired
    private PluginsContainer pluginsContainer;

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
            FailureDetails failureDetails) throws Exception {
        return service.updateLaunchTestCaseStatus(request, getUserSession(), projectId, launchId, testcaseUUID, status, failureDetails);
    }

    @GET
    @Path("/statistics")
    public Map<String, LaunchStatistics> getLaunchesStatistics(@ApiParam(value = "Project Id", required = true) @PathParam("projectId") String projectId) throws Exception {
        return service.getLaunchesStatistics(getUserSession(), projectId, initFilter(request));
    }

    @GET
    @Path("/heatmap")
    public Collection<LaunchTestcaseStats> getLaunchTestcasesHeatMap(@ApiParam(value = "Project Id", required = true)
                                                                     @PathParam("projectId") String projectId,
                                                                     @QueryParam("statsTopLimit") int statsTopLimit) throws Exception {
        return service.getTestCasesHeatMap(getUserSession(), projectId, initFilter(request), statsTopLimit);
    }


    @Override
    public Launch create(String projectId, Launch launch) {
        if (launch.getEnvironments().isEmpty()) {
            return create(projectId, Collections.singletonList(launch)).get(0);
        }
        final String launchGroup = UUID.randomUUID().toString();
        List<Launch> launchesToCreate = launch.getEnvironments().stream().map(environment -> {
            Launch launchToCreate = (Launch) new Launch().withTestSuite(new TestSuite().withFilter(new TestcaseFilter()));
            launch.copyTo(launchToCreate);
            launchToCreate.setLaunchGroup(launchGroup);
            launchToCreate.setEnvironment(environment);
            launchToCreate.setName(format("%s - [%s]", launch.getName(), environment));
            return launchToCreate;
        }).collect(Collectors.toList());
        return create(projectId, launchesToCreate).get(0);
    }

    private List<Launch> create(String projectId, List<Launch> launches) {
        List<Launch> createdLaunches = new ArrayList<>(launches.size());
        launches.forEach(launch -> {
            if (launch.getLauncherConfig() != null && launch.getLauncherConfig().getLauncherId() != null) {
                Launcher launcher = pluginsContainer.getPlugin(Launcher.class, launch.getLauncherConfig().getLauncherId());
                //Create launch to have an id in launcher
                if (launcher.isToCreateLaunch()) {
                    launch = super.create(projectId, launch);
                }
                try {
                    launcher.launch(launch, projectId, request);
                    //Update launch with enriched data from launcher
                    if (launcher.isToCreateLaunch()) {
                        launch = super.update(projectId, launch);
                    }
                    createdLaunches.add(launch);
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            } else {
                launch = super.create(projectId, launch);
                createdLaunches.add(launch);
            }
        });
        return createdLaunches;
    }

    @POST
    @Path("/{launchId}/restart")
    public Launch restartLaunch(
            @ApiParam(value = "Project Id", required = true) @PathParam("projectId") String projectId,
            @ApiParam(value = "Source Launch ID", required = true) @PathParam("launchId") String launchId,
            @ApiParam(value = "Restart Failed Only", defaultValue = "false") @QueryParam("failedOnly") boolean failedOnly,
            Launch launch) {
        return create(projectId, service.cleanLaunchForRestart(getUserSession(), projectId, launch, failedOnly));
    }
}
