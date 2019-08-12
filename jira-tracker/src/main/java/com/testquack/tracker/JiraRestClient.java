package com.testquack.tracker;

import com.testquack.tracker.jira.IssuesSearchResults;
import com.testquack.tracker.jira.JiraField;
import com.testquack.tracker.jira.JiraIssue;
import com.testquack.tracker.jira.JiraProject;
import com.testquack.tracker.jira.CreateJiraIssue;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Path;
import retrofit2.http.Query;

import java.util.List;

public interface JiraRestClient {

    @GET("issue/{issueIdOrKey}")
    Call<JiraIssue> getIssue(@Path("issueIdOrKey") String issueIdOrKey);

    @GET("project")
    Call<List<JiraProject>> getProjects();

    @GET("project/{id}")
    Call<JiraProject> getProject(@Path("id") String jiraProjectId);

    @POST("issue")
    Call<JiraIssue> createIssue(@Body CreateJiraIssue jiraIssue);

    @GET("search")
    Call<IssuesSearchResults> suggestIssues(@Query("jql") String jql);

    @GET("priority")
    Call<List<JiraField>> getPriorities();

}
