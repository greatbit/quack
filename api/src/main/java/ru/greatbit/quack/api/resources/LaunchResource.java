package ru.greatbit.quack.api.resources;

import org.springframework.beans.factory.annotation.Autowired;
import ru.greatbit.quack.beans.Launch;
import ru.greatbit.quack.services.BaseService;
import ru.greatbit.quack.services.LaunchService;
import ru.greatbit.whoru.jaxrs.Authenticable;

import javax.ws.rs.Path;

@Authenticable
@Path("/{projectId}/launch")
public class LaunchResource extends BaseCrudResource<Launch> {

    @Autowired
    private LaunchService service;

    @Override
    protected BaseService<Launch> getService() {
        return service;
    }


}
