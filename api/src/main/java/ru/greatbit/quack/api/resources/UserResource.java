package ru.greatbit.quack.api.resources;

import org.springframework.beans.factory.annotation.Autowired;
import ru.greatbit.quack.beans.Filter;
import ru.greatbit.quack.beans.User;
import ru.greatbit.quack.services.BaseService;
import ru.greatbit.quack.services.UserService;
import ru.greatbit.whoru.auth.AuthProvider;
import ru.greatbit.whoru.auth.RedirectResponse;
import ru.greatbit.whoru.auth.Session;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Response;
import java.util.Set;

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

    @POST
    @Path("/login")
    public Session login(@QueryParam("login") String login,
                         @QueryParam("password") String password) {
        return authProvider.doAuth(request, response);
    }

    @GET
    @Path("/login-redirect")
    public RedirectResponse getLoginRedirect(){
        return authProvider.redirectNotAuthTo(request);
    }

    @DELETE
    @Path("/logout")
    public Response logout() {
        authProvider.doLogout(request, response);
        return Response.ok().build();
    }

    @GET
    @Path("/groups")
    public Set<String> getGroups(){
        return authProvider.getAllGroups(request);
    }

    @GET
    @Path("/groups/suggest/{literal}")
    public Set<String> suggestGroups(@PathParam("literal") String literal){
        return authProvider.suggestGroups(request, literal);
    }

    @GET
    @Path("/users")
    public Set<String> getUsers(){
        return authProvider.getAllUsers(request);
    }

    @GET
    @Path("/users/suggest/{literal}")
    public Set<String> suggestUsers(@PathParam("literal") String literal){
        return authProvider.suggestUser(request, literal);
    }

}
