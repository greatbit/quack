package ru.greatbit.quack.api.resources;

import org.springframework.beans.factory.annotation.Autowired;
import ru.greatbit.quack.beans.Filter;
import ru.greatbit.quack.beans.User;
import ru.greatbit.quack.services.BaseService;
import ru.greatbit.quack.services.UserService;
import ru.greatbit.whoru.auth.AuthProvider;
import ru.greatbit.whoru.auth.Session;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;

@Path("/user")
public class UserResource extends BaseResource<User> {

    @Autowired
    AuthProvider authProvider;

    @Autowired
    private UserService service;

    @Override
    protected Filter initFilter(HttpServletRequest hsr) {
        return new Filter();
    }

    @Override
    protected BaseService<User> getService() {
        return service;
    }

    @GET
    @Path("/session")
    public Session getSession() {
        return authProvider.getSession(request);
    }

    //@POST
    @GET
    @Path("/login")
    public Response login(@QueryParam("login") String login,
                          @QueryParam("password") String password) {
        authProvider.doAuth(request, response);
        return Response.ok().build();
    }

    @DELETE
    @Path("/logout")
    public Response logout() {
        authProvider.doLogout(request, response);
        return Response.ok().build();
    }

}
