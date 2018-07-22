package ru.greatbit.quack.api.resources;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import ru.greatbit.quack.beans.Entity;

import javax.ws.rs.*;
import javax.ws.rs.core.Response;
import java.util.Collection;

import static javax.ws.rs.core.Response.ok;

public abstract class BaseCrudResource<E extends Entity> extends BaseResource<E> {

    @GET
    @Path("/{projectId}")
    public Collection<E> findFiltered(@ApiParam(value = "Project Id", required = true) @PathParam("projectId") String projectId) {
        return getService().findFiltered(getUserSession(), projectId, initFilter(request));
    }

    @GET
    @Path("/{projectId}/{id}")
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
