package com.testquack.api.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import ru.greatbit.whoru.auth.Session;
import ru.greatbit.whoru.auth.providers.CognitoAuthProvider;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Service
public class OrgCognitoAuthProvider extends CognitoAuthProvider {

    @Value("${quack.organizations.enabled}")
    private boolean ORGANIZATIONS_ENABLED;

    @Override
    public Session doAuth(HttpServletRequest request, HttpServletResponse response) {
        Session session = super.doAuth(request, response);
        if (ORGANIZATIONS_ENABLED){
            session.getMetainfo().put("organizationsEnabled", true);
        }
        return session;
    }
}
