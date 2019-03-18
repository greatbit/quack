package ru.greatbit.quack.api.resources;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import ru.greatbit.quack.beans.Entity;
import ru.greatbit.quack.beans.Filter;
import ru.greatbit.quack.beans.Order;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Response;
import java.util.Arrays;
import java.util.Collection;

import static javax.ws.rs.core.Response.ok;

public abstract class BaseCrudResource<E extends Entity> extends BaseResource<E> {

    public final static String SKIP = "skip";
    public final static String LIMIT = "limit";
    public final static String DELETED = "deleted";
    public final static String ORDER_BY = "orderby";
    public final static String ORDER_DIR = "orderdir";
    public final static String INCLUDED_FIELDS = "includedFields";
    public final static String EXCLUDED_FIELDS = "excludedFields";
    public final static String NOT_PREFIX = "not_";

    @Override
    protected Filter initFilter(HttpServletRequest hsr) {
        Filter filter = new Filter().withField(DELETED, false);
        if (hsr.getParameter(SKIP) != null) {
            filter.setSkip(Integer.parseInt(hsr.getParameter(SKIP)));
        }
        if (hsr.getParameter(LIMIT) != null) {
            filter.setLimit(Integer.parseInt(hsr.getParameter(LIMIT)));
        }

        //Add fields filter
        hsr.getParameterMap().entrySet().stream().
                filter(entry -> !entry.getKey().equals(SKIP) && !entry.getKey().equals(LIMIT)).
                filter(entry -> !entry.getKey().startsWith(NOT_PREFIX)).
                filter(entry -> !entry.getKey().startsWith(ORDER_BY)).
                filter(entry -> !entry.getKey().startsWith(ORDER_DIR)).
                filter(entry -> !entry.getKey().startsWith(INCLUDED_FIELDS)).
                filter(entry -> !entry.getKey().startsWith(EXCLUDED_FIELDS)).
                forEach(entry -> filter.addFields(entry.getKey(), entry.getValue()));

        //Add NOT fields filter
        hsr.getParameterMap().entrySet().stream().
                filter(entry -> entry.getKey().startsWith(NOT_PREFIX)).
                forEach(entry -> filter.addNotFields(entry.getKey().replace(NOT_PREFIX, ""), entry.getValue()));

        //Included and Excluded fields
        if (hsr.getParameter(INCLUDED_FIELDS) != null) {
            filter.getIncludedFields().addAll(Arrays.asList(hsr.getParameter(INCLUDED_FIELDS).split(",")));
        }
        if (hsr.getParameter(EXCLUDED_FIELDS) != null) {
            filter.getIncludedFields().addAll(Arrays.asList(hsr.getParameter(EXCLUDED_FIELDS).split(",")));
        }

        //Sort order
        if (hsr.getParameter("orderby") != null){
            filter.setSortField(hsr.getParameter("orderby"));
            try {
                filter.setOrder(Order.fromValue(hsr.getParameter("orderdir")));
            } catch (Exception e){
                filter.setOrder(Order.ASC);
            }
        }
        return filter;
    }

    @GET
    @Path("/")
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
    @Path("/")
    @ApiOperation(value = "Create entity", notes = "")
    @ApiResponses(value = {
            @ApiResponse(code = 403, message = "Access denied to the entity"),
            @ApiResponse(code = 200, message = "Created entity")
    })
    public E create(@ApiParam(value = "Project Id", required = true) @PathParam("projectId") String projectId,
            @ApiParam(value = "Entity", required = true) E entity) {
        return getService().save(getUserSession(), projectId, entity);
    }

    @PUT
    @Path("/")
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
    @Path("/{id}")
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
    @Path("/count")
    @ApiOperation(value = "Count", notes = "")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Successful operation", response = long.class)
    })
    public long count(@ApiParam(value = "Project Id", required = true) @PathParam("projectId") String projectId){
        return getService().count(getUserSession(), projectId, initFilter(request));
    }


}
