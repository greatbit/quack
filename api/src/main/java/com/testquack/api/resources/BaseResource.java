package com.testquack.api.resources;

import com.testquack.beans.Entity;
import com.testquack.beans.Filter;
import com.testquack.services.BaseService;
import ru.greatbit.whoru.auth.Session;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.SecurityContext;

@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public abstract class BaseResource<E extends Entity> {

    @Context
    protected HttpServletRequest request;

    @Context
    protected HttpServletResponse response;

    @Context
    protected SecurityContext securityContext;

    protected Session getUserSession() {
        return (Session) securityContext.getUserPrincipal();
    }

    protected abstract Filter initFilter(HttpServletRequest hsr);

    protected abstract BaseService<E> getService();

}
