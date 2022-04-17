package com.testquack.api.resources;

import com.testquack.beans.Filter;
import com.testquack.beans.LauncherConfigDescriptor;
import com.testquack.beans.Project;
import com.testquack.launcher.Launcher;
import com.testquack.services.BaseService;
import org.springframework.beans.factory.annotation.Autowired;
import ru.greatbit.plow.PluginsContainer;
import ru.greatbit.whoru.jaxrs.Authenticable;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import java.util.List;
import java.util.Set;

import static java.util.stream.Collectors.toList;

@Authenticable
@Path("/launcher")
public class LauncherResource extends BaseResource<Project> {

    @Autowired
    private PluginsContainer pluginsContainer;

    @GET
    @Path("/")
    public Set<String> getLaunchersList() {
        return pluginsContainer.getPlugins(Launcher.class).keySet();
    }

    @GET
    @Path("/descriptors")
    public List<LauncherConfigDescriptor> getLaunchersDescriptors() {
        return pluginsContainer.getPlugins(Launcher.class).values().stream().map(Launcher::getConfigDescriptor).collect(toList());
    }


    @GET
    @Path("/{id}/descriptor")
    public LauncherConfigDescriptor getLaunchersDescriptor(@PathParam("id") String launcherId) {
        return pluginsContainer.getPlugins(Launcher.class).get(launcherId).getConfigDescriptor();
    }

    @Override
    protected Filter initFilter(HttpServletRequest hsr) {
        throw new UnsupportedOperationException();
    }

    @Override
    protected BaseService<Project> getService() {
        throw new UnsupportedOperationException();
    }
}
