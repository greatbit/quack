package com.testquack.api.resources;

import com.testquack.api.utils.FilterUtils;
import com.testquack.beans.ChangePasswordRequest;
import com.testquack.beans.Filter;
import com.testquack.beans.User;
import com.testquack.services.BaseService;
import com.testquack.services.UserService;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import ru.greatbit.whoru.auth.AuthProvider;
import ru.greatbit.whoru.auth.RedirectResponse;
import ru.greatbit.whoru.auth.Session;
import ru.greatbit.whoru.auth.SessionProvider;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.util.Collection;
import java.util.Set;

@Path("/user")
public class UserResource extends BaseResource<User> {

    @Autowired
    AuthProvider authProvider;

    @Autowired
    SessionProvider sessionProvider;

    @Autowired
    private UserService service;

    @Value("${quack.ui.url}")
    private String baseUiUrl;

    @Override
    protected Filter initFilter(HttpServletRequest hsr) {
        return FilterUtils.initFilter(request);
    }

    @Override
    protected BaseService<User> getService() {
        return service;
    }

    @GET
    @Path("/{login}")
    public User getUser(@PathParam("login") String login) {
        return service.findOne(getSession(), null, login);
    }

    @DELETE
    @Path("/{login}")
    public Response delete(@PathParam("login") String login) {
        service.delete(getSession(), null, getUser(login).getId());
        return Response.ok().build();
    }

    @POST
    @Path("/")
    public User createUser(User user){
        return service.save(getSession(), null, user);
    }

    @PUT
    @Path("/")
    public User updateUser(User user){
        return service.save(getSession(), null, user);
    }

    @GET
    @Path("/")
    public Collection<User> findFiltered() {
        return getService().findFiltered(getSession(), null, initFilter(request));
    }

    @GET
    @Path("/count")
    @ApiOperation(value = "Count", notes = "")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Successful operation", response = long.class)
    })
    public long count(){
        return getService().count(getSession(), null, initFilter(request));
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
    @Path("/auth")
    public Session login() throws IOException {
        return authProvider.doAuth(request, response);
    }

    @GET
    @Path("/login-redirect")
    public RedirectResponse getLoginRedirect(){
        return authProvider.redirectNotAuthTo(request);
    }

    @GET
    @Path("/create-redirect")
    public RedirectResponse getCreateUserRedirect(){
        return authProvider.redirectCreateUserTo(request);
    }

    @GET
    @Path("/all-redirect")
    public RedirectResponse getAllUsersRedirect(){
        return authProvider.redirectViewAllUsersTo(request);
    }

    @POST
    @Path("/change-password")
    public Response changePassword(ChangePasswordRequest changePasswordRequest){
        Session session = getSession();
        String login = changePasswordRequest.getLogin() == null ? getSession().getPerson().getLogin() : changePasswordRequest.getLogin();
        service.changePassword(session, login, changePasswordRequest.getOldPassword(), changePasswordRequest.getNewPassword());
        session.getPerson().setDefaultPassword(false);
        sessionProvider.replaceSession(session);
        return Response.ok().build();
    }

    @GET
    @Path("/change-password-redirect")
    public RedirectResponse changePasswordRedirect(){
        return authProvider.redirectChangePasswordTo(request);
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
    @Path("/groups/suggest")
    public Set<String> suggestGroups(@QueryParam("literal") String literal) {
        return authProvider.suggestGroups(request, literal);
    }

    @GET
    @Path("/users")
    public Set<String> getUsers(){
        return authProvider.getAllUsers(request);
    }

    @GET
    @Path("/users/suggest")
    public Set<String> suggestUsers(@QueryParam("literal") String literal) {
        return authProvider.suggestUser(request, literal);
    }

    @POST
    @Path("/changeorg/{orgId}")
    public Session login(@PathParam("orgId") String organizationId) {
        Session session = service.changeOrganization(getSession(), organizationId);
        sessionProvider.replaceSession(session);
        return session;
    }

}
