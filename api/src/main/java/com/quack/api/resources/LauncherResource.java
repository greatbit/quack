package com.quack.api.resources;

import com.quack.beans.Filter;
import com.quack.beans.LauncherConfigDescriptor;
import com.quack.beans.Project;
import com.quack.launcher.Launcher;
import com.quack.services.BaseService;
import org.springframework.beans.factory.annotation.Autowired;
import ru.greatbit.plow.PluginsContainer;
import ru.greatbit.whoru.jaxrs.Authenticable;
import sun.reflect.generics.reflectiveObjects.NotImplementedException;

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
        throw new NotImplementedException();
    }

    @Override
    protected BaseService<Project> getService() {
        throw new NotImplementedException();
    }
}
