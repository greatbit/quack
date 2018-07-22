package ru.greatbit.quack.api.resources;

import org.springframework.beans.factory.annotation.Autowired;
import ru.greatbit.quack.beans.User;
import ru.greatbit.quack.services.BaseService;
import ru.greatbit.quack.services.UserService;

import javax.ws.rs.Path;

@Path("/user")
public class UserResource extends BaseCrudResource<User> {

    @Autowired
    private UserService service;

    @Override
    protected BaseService<User> getService() {
        return service;
    }

}
