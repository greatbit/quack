package com.testquack.launcher;

public class LikenLauncherConfig {

    @ConfigItem(title = "Api Endpoint")
    private String apiEndpoint;

    @ConfigItem(title = "Frontend Endpoint")
    private String frontendEndpoint;

    @ConfigItem(title = "Comma Separated Placeholders")
    private String placeholders;

    @ConfigItem(title = "Timeout", defaultValues = "30000")
    private int timeout;

    @ConfigItem(title = "Prefix A")
    private String prefixA;

    @ConfigItem(title = "URL A")
    private String urlA;

    @ConfigItem(title = "Params A")
    private String paramsA;


    @ConfigItem(title = "Prefix B")
    private String prefixB;

    @ConfigItem(title = "URL B")
    private String urlB;

    @ConfigItem(title = "Params B")
    private String paramsB;


    public String getApiEndpoint() {
        return apiEndpoint;
    }

    public void setApiEndpoint(String apiEndpoint) {
        this.apiEndpoint = apiEndpoint;
    }

    public String getFrontendEndpoint() {
        return frontendEndpoint;
    }

    public void setFrontendEndpoint(String frontendEndpoint) {
        this.frontendEndpoint = frontendEndpoint;
    }

    public String getPlaceholders() {
        return placeholders;
    }

    public void setPlaceholders(String placeholders) {
        this.placeholders = placeholders;
    }

    public int getTimeout() {
        return timeout;
    }

    public void setTimeout(int timeout) {
        this.timeout = timeout;
    }

    public String getUrlA() {
        return urlA;
    }

    public void setUrlA(String urlA) {
        this.urlA = urlA;
    }

    public String getParamsA() {
        return paramsA;
    }

    public void setParamsA(String paramsA) {
        this.paramsA = paramsA;
    }

    public String getUrlB() {
        return urlB;
    }

    public void setUrlB(String urlB) {
        this.urlB = urlB;
    }

    public String getParamsB() {
        return paramsB;
    }

    public void setParamsB(String paramsB) {
        this.paramsB = paramsB;
    }

    public String getPrefixA() {
        return prefixA;
    }

    public void setPrefixA(String prefixA) {
        this.prefixA = prefixA;
    }

    public String getPrefixB() {
        return prefixB;
    }

    public void setPrefixB(String prefixB) {
        this.prefixB = prefixB;
    }
}
