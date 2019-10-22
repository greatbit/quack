package com.testquack.api.resources;

import com.testquack.beans.Event;
import com.testquack.services.BaseService;
import com.testquack.services.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import ru.greatbit.whoru.jaxrs.Authenticable;

import javax.ws.rs.Path;

@Authenticable
@Path("/{projectId}/audit")
public class EventResource extends BaseCrudResource<Event> {

    @Autowired
    private EventService service;

    @Override
    protected BaseService<Event> getService() {
        return service;
    }


}
