package com.testquack.client;

import okhttp3.Interceptor;
import okhttp3.Request;
import okhttp3.Response;

import java.io.IOException;

public class TokenInterceptor implements Interceptor {

    public final static String API_TOKEN_HEADER = "Whoru-Api-Token";

    private final String apiToken;

    public TokenInterceptor(String apiToken) {
        this.apiToken = apiToken;
    }

    @Override
    public Response intercept(Chain chain) throws IOException {
        Request.Builder builder = chain.request().newBuilder();
        if (apiToken != null && !"".equals(apiToken)) {
            builder.addHeader(API_TOKEN_HEADER, apiToken);
        }
        return chain.proceed(builder.build());
    }
}
