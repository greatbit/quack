package com.testquack.api.resources;

import com.testquack.beans.Attribute;
import com.testquack.services.AttributeService;
import com.testquack.services.BaseService;
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
