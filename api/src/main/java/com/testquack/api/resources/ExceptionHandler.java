package com.testquack.api.resources;

import com.testquack.api.errors.LicenseCapacityReachedException;
import com.testquack.services.errors.EntityAccessDeniedException;
import com.testquack.services.errors.EntityNotFoundException;
import com.testquack.services.errors.EntityValidationException;
import com.testquack.tracker.errors.TrackerValidationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.greatbit.whoru.auth.Session;
import ru.greatbit.whoru.auth.error.UnauthorizedException;

import javax.ws.rs.NotFoundException;
import javax.ws.rs.ServiceUnavailableException;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

import static javax.ws.rs.core.Response.Status.*;
import static javax.ws.rs.core.Response.Status.INTERNAL_SERVER_ERROR;
import static javax.ws.rs.core.Response.status;

@Provider
public class ExceptionHandler implements ExceptionMapper<Exception> {
    private final Logger logger = LoggerFactory.getLogger(getClass());

    @Context
    private SecurityContext securityContext;

    @Override
    public Response toResponse(Exception error) {
        try {
            logger.warn("Exception has occurred for user {} : {}",
                    (securityContext != null && getUserSession() != null) ? getUserSession().getName() : "Unknown",
                    error.getMessage(), error);
            throw error;
        } catch (NotFoundException | EntityNotFoundException e) {
            return createResponse(NOT_FOUND, e);
        } catch (EntityValidationException | TrackerValidationException e) {
            return createResponse(BAD_REQUEST, e);
        } catch (UnauthorizedException e ) {
            return createResponse(UNAUTHORIZED, e);
        } catch (EntityAccessDeniedException e){
            return createResponse(FORBIDDEN, e);
        } catch (ServiceUnavailableException e){
            return createResponse(SERVICE_UNAVAILABLE, e);
        } catch (WebApplicationException e) {
            return createResponse(e.getResponse().getStatusInfo(), e);
        } catch (LicenseCapacityReachedException e){
            return createResponse(PAYMENT_REQUIRED, e);
        } catch (RuntimeException re) {
            return createResponse(BAD_REQUEST, re);
        } catch (Exception e) {
            logger.error("Unhandled exception", e);
            return createResponse(INTERNAL_SERVER_ERROR, e);
        }
    }

    protected Session getUserSession() {
        return (Session) securityContext.getUserPrincipal();
    }

    protected Response createResponse(Response.StatusType status, Exception e) {
        return status(status).entity(new Object(){
            public String message = e.getMessage();
            public int code = status.getStatusCode();
        }).build();
    }
}
