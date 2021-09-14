package com.testquack.api.security;

import ru.greatbit.whoru.auth.Session;
import ru.greatbit.whoru.auth.providers.BaseAuthProvider;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class CognitoAuthProvider extends BaseAuthProvider {
    @Override
    public Session authImpl(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) {
        return null;
    }
}
