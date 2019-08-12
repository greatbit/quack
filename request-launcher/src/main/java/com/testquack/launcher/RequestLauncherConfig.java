package com.testquack.launcher;

public class RequestLauncherConfig {
    @ConfigItem(title = "Endpoint")
    private String endpoint;

    @ConfigItem(title = "Request type", restricted = true, defaultValues = {"POST", "GET", "PUT"})
    private String requestType;

    @ConfigItem(title = "Request Body")
    private String requestBody;

    @ConfigItem(title = "Request Headers")
    private String requestHeaders;

    @ConfigItem(title = "Timeout", defaultValues = "30000")
    private int timeout;

    public RequestLauncherConfig() {
    }

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
