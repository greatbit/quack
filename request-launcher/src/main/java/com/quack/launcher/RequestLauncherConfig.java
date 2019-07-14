package com.quack.launcher;

public class RequestLauncherConfig {
    @ConfigItem(title = "Endpoint")
    private final String endpoint;

    @ConfigItem(title = "Request type", restricted = true, defaultValues = {"POST", "GET", "PUT"})
    private final String requestType;

    @ConfigItem(title = "Request Body")
    private final String requestBody;

    @ConfigItem(title = "Request Headers")
    private final String requestHeaders;

    @ConfigItem(title = "Timeout", defaultValues = "30000")
    private final int timeout;

    public RequestLauncherConfig(String endpoint, String requestType, String requestBody, String requestHeaders, int timeout) {
        this.endpoint = endpoint;
        this.requestType = requestType;
        this.requestBody = requestBody;
        this.requestHeaders = requestHeaders;
        this.timeout = timeout;
    }

    public String getEndpoint() {
        return endpoint;
    }

    public String getRequestType() {
        return requestType;
    }

    public String getRequestBody() {
        return requestBody;
    }

    public String getRequestHeaders() {
        return requestHeaders;
    }

    public int getTimeout() {
        return timeout;
    }
}
