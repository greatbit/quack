package com.testquack.api.resources;

import com.testquack.api.utils.FilterUtils;
import com.testquack.beans.Filter;
import com.testquack.beans.Organization;
import com.testquack.services.BaseService;
import com.testquack.services.OrganizationService;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import ru.greatbit.whoru.jaxrs.Authenticable;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Response;
import java.util.Collection;

import static javax.ws.rs.core.Response.ok;

@Authenticable
@Path("/organization")
public class OrganizationResource extends BaseResource<Organization> {

    @Autowired
    private OrganizationService service;

    @Override
    protected Filter initFilter(HttpServletRequest hsr) {
        return FilterUtils.initFilter(hsr);
    }

    @Override
    protected BaseService<Organization> getService() {
        return service;
    }

    @GET
    public Collection<Organization> findFiltered() {
        return getService().findFiltered(getUserSession(), null, initFilter(request));
    }

    @GET
    @Path("/{id}")
    @ApiOperation(value = "Find entity by id", notes = "")
    @ApiResponses(value = {
            @ApiResponse(code = 400, message = "Entity not found"),
            @ApiResponse(code = 403, message = "Access denied to the entity"),
            @ApiResponse(code = 200, message = "Successful operation")
    })
    public Organization findOne(@ApiParam(value = "Entity Id", required = true) @PathParam("id") String id) {
        return getService().findOne(getUserSession(), id, id);
    }

    @POST
    @ApiOperation(value = "Create entity", notes = "")
    @ApiResponses(value = {
            @ApiResponse(code = 403, message = "Access denied to the entity"),
            @ApiResponse(code = 200, message = "Created entity")
    })
    public Organization create(@ApiParam(value = "Entity", required = true) Organization entity) {
        return ((OrganizationService) getService()).createOrganization(getUserSession(), entity);
    }

    @PUT
    @ApiOperation(value = "Update entity", notes = "")
    @ApiResponses(value = {
            @ApiResponse(code = 403, message = "Access denied to the entity"),
            @ApiResponse(code = 200, message = "Updated entity")
    })
    public Organization update(@ApiParam(value = "Entity", required = true) Organization entity) {
        return getService().save(getUserSession(), null, entity);
    }


    @DELETE
    @Path("/{id}")
    @ApiOperation(value = "Delete entity", notes = "")
    @ApiResponses(value = {
            @ApiResponse(code = 403, message = "Access denied to the entity"),
            @ApiResponse(code = 200, message = "Successful operation")
    })
    public Response delete(@ApiParam(value = "Id", required = true) @PathParam("id") String id) {
        getService().delete(getUserSession(), null, id);
        return ok().build();
    }

}
