package com.testquack.api.security;

import com.testquack.beans.User;
import com.testquack.dal.UserRepository;
import com.testquack.services.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import ru.greatbit.whoru.auth.AuthProvider;
import ru.greatbit.whoru.auth.Session;
import ru.greatbit.whoru.jaxrs.Authenticable;
import ru.greatbit.whoru.jaxrs.WhoruSecurityContext;

import javax.annotation.Priority;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Priorities;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.container.ContainerResponseFilter;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.Provider;
import java.io.IOException;

import static java.lang.String.format;
import static org.springframework.util.StringUtils.isEmpty;
import static ru.greatbit.whoru.auth.utils.HttpUtils.SESSION_ID;
import static ru.greatbit.whoru.auth.utils.HttpUtils.createCookie;
import static ru.greatbit.whoru.auth.utils.HttpUtils.isTokenAccessRequest;

@Provider
@Service
@Authenticable
@Priority(Priorities.AUTHENTICATION)
public class AuthFilter implements ContainerRequestFilter, ContainerResponseFilter {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    AuthProvider authProvider;

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserService userService;

    @Context
    HttpServletRequest request;

    @Context
    HttpServletResponse response;

    @Value("${auth.domain}")
    String authDomain;

    @Value("${auth.session.ttl}")
    int sessionTtl;

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        if (isTokenAccessRequest(request) && !authProvider.isAuthenticated(request)){
            authProvider.doAuth(request, null);
        }
        if (authProvider.isAuthenticated(request)){
            final Session session = authProvider.getSession(request);
            logger.debug(format("Session exists: %s, login %s", session.getId(), session.getName()));
            if (session.getPerson().getLogin() != null && !userRepository.exists(userService.getCurrOrganizationId(session),null, session.getPerson().getLogin())) {
                userRepository.save(
                        userService.getCurrOrganizationId(session),
                        null,
                        new User().withCreatedTime(System.currentTimeMillis()).
                                withId(session.getPerson().getLogin()).
                                withLogin(session.getPerson().getLogin()).
                                withToken(session.getPerson().getToken()).
                                withLastModifiedTime(System.currentTimeMillis()).
                                withFirstName(session.getPerson().getFirstName()).
                                withLastName(session.getPerson().getLastName())
                );
            }
            if (!isTokenAccessRequest(request))
                requestContext.setProperty(SESSION_ID, session.getId());
            requestContext.setSecurityContext(new WhoruSecurityContext(session));
        } else {
            requestContext.abortWith(Response
                    .status(Response.Status.UNAUTHORIZED)
                    .entity("User cannot access the resource.")
                    .build());
        }
    }

    @Override
    public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext) {
        if (request != null && !isTokenAccessRequest(request)) {
            final String sessionId = (String) requestContext.getProperty(SESSION_ID);
            if (!isEmpty(sessionId))
                response.addCookie(createCookie(SESSION_ID, sessionId, authDomain, sessionTtl));
            else {
                response.addCookie(createCookie(SESSION_ID, sessionId, authDomain, 0));
            }
        }
    }
}
