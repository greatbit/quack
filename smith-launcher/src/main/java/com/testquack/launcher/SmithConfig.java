package com.testquack.launcher;

public class SmithConfig {

    @ConfigItem(title = "Api Endpoint")
    private String apiEndpoint;

    @ConfigItem(title = "Results Arn")
    private String resultsArn;

    @ConfigItem(title = "S3 Arn")
    private String s3Arn;

    @ConfigItem(title = "AWS Account Id")
    private String awsAccountId;

    @ConfigItem(title = "Timeout", defaultValues = "30000")
    private int timeout;

    public String getApiEndpoint() {
        return apiEndpoint;
    }

    public void setApiEndpoint(String apiEndpoint) {
        this.apiEndpoint = apiEndpoint;
    }

    public String getResultsArn() {
        return resultsArn;
    }

    public void setResultsArn(String resultsArn) {
        this.resultsArn = resultsArn;
    }

    public String getS3Arn() {
        return s3Arn;
    }

    public void setS3Arn(String s3Arn) {
        this.s3Arn = s3Arn;
    }

    public String getAwsAccountId() {
        return awsAccountId;
    }

    public void setAwsAccountId(String awsAccountId) {
        this.awsAccountId = awsAccountId;
    }

    public int getTimeout() {
        return timeout;
    }

    public void setTimeout(int timeout) {
        this.timeout = timeout;
    }
}
