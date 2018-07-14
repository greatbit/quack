package ru.greatbit.quack.api.resources;

import org.springframework.beans.factory.annotation.Autowired;
import ru.greatbit.quack.beans.Attribute;
import ru.greatbit.quack.services.AttributeService;
import ru.greatbit.quack.services.BaseService;

import javax.ws.rs.*;

@Path("/attribute")
public abstract class AttributeResource extends BaseCrudResource<Attribute> {

    @Autowired
    private AttributeService service;

    @Override
    protected BaseService<Attribute> getService() {
        return service;
    }


}
