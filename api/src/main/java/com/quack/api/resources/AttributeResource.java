package com.quack.api.resources;

import com.quack.beans.Attribute;
import com.quack.services.AttributeService;
import com.quack.services.BaseService;
import org.springframework.beans.factory.annotation.Autowired;
import ru.greatbit.whoru.jaxrs.Authenticable;

import javax.ws.rs.*;

@Authenticable
@Path("/{projectId}/attribute")
public class AttributeResource extends BaseCrudResource<Attribute> {

    @Autowired
    private AttributeService service;

    @Override
    protected BaseService<Attribute> getService() {
        return service;
    }


}
