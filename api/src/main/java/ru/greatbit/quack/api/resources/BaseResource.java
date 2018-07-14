package ru.greatbit.quack.api.resources;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import ru.greatbit.quack.beans.Entity;
import ru.greatbit.quack.beans.Filter;
import ru.greatbit.quack.beans.Session;
import ru.greatbit.quack.services.BaseService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import java.util.Collection;

import static javax.ws.rs.core.Response.ok;

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

    @GET
    @Path("/{projectId}")
    public Collection<E> findFiltered(@ApiParam(value = "Project Id", required = true) @PathParam("projectId") String projectId) {
        return getService().findFiltered(getUserSession(), projectId, initFilter(request));
    }

    @GET
    @Path("/{id}")
    @ApiOperation(value = "Find entity by id", notes = "")
    @ApiResponses(value = {
            @ApiResponse(code = 400, message = "Entity not found"),
            @ApiResponse(code = 403, message = "Access denied to the entity"),
            @ApiResponse(code = 200, message = "Successful operation")
    })
    public E findOne(@ApiParam(value = "Project Id", required = true) @PathParam("projectId") String projectId,
            @ApiParam(value = "Entity Id", required = true) @PathParam("id") String id) {
        return getService().findOne(getUserSession(), projectId, id);
    }

    @POST
    @Path("/{projectId}")
    @ApiOperation(value = "Create entity", notes = "")
    @ApiResponses(value = {
            @ApiResponse(code = 403, message = "Access denied to the entity"),
            @ApiResponse(code = 200, message = "Created entity")
    })
    public E create(@ApiParam(value = "Project Id", required = true) @PathParam("projectId") String projectId,
            @ApiParam(value = "Entity", required = true) E entity) {
        entity.setId(null);
        return getService().save(getUserSession(), projectId, entity);
    }

    @PUT
    @Path("/{projectId}")
    @ApiOperation(value = "Update entity", notes = "")
    @ApiResponses(value = {
            @ApiResponse(code = 403, message = "Access denied to the entity"),
            @ApiResponse(code = 200, message = "Updated entity")
    })
    public E update(@ApiParam(value = "Project Id", required = true) @PathParam("projectId") String projectId,
            @ApiParam(value = "Entity", required = true) E entity) {
        return getService().save(getUserSession(), projectId, entity);
    }

    @PUT
    @Path("/{projectId}/{id}")
    @ApiOperation(value = "Update entity", notes = "")
    @ApiResponses(value = {
            @ApiResponse(code = 403, message = "Access denied to the entity"),
            @ApiResponse(code = 200, message = "Updated entity")
    })
    public E update(@ApiParam(value = "Project Id", required = true) @PathParam("projectId") String projectId,
            @ApiParam(value = "Entity Id", required = true) @PathParam("id") String id,
                      @ApiParam(value = "Entity", required = true) E entity) {
        return getService().save(getUserSession(), projectId, entity);
    }

    @DELETE
    @Path("/{projectId}/{id}")
    @ApiOperation(value = "Delete entity", notes = "")
    @ApiResponses(value = {
            @ApiResponse(code = 403, message = "Access denied to the entity"),
            @ApiResponse(code = 200, message = "Successful operation")
    })
    public Response delete(@ApiParam(value = "Project Id", required = true) @PathParam("projectId") String projectId,
            @ApiParam(value = "Id", required = true) @PathParam("id") String id) {
        getService().delete(getUserSession(), projectId, id);
        return ok().build();
    }

    @GET
    @Path("/{projectId}/count")
    @ApiOperation(value = "Count", notes = "")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Successful operation", response = long.class)
    })
    public long count(@ApiParam(value = "Project Id", required = true) @PathParam("projectId") String projectId){
        return getService().count(getUserSession(), projectId, initFilter(request));
    }


}
