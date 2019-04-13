package ru.greatbit.quack.tracker;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Path;
import retrofit2.http.Query;
import ru.greatbit.quack.tracker.jira.CreateJiraIssue;
import ru.greatbit.quack.tracker.jira.IssuesSearchResults;
import ru.greatbit.quack.tracker.jira.JiraField;
import ru.greatbit.quack.tracker.jira.JiraIssue;
import ru.greatbit.quack.tracker.jira.JiraProject;

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

    @GET("issue")
    Call<IssuesSearchResults> suggestIssues(@Query("jql") String jql);

    @GET("priority")
    Call<List<JiraField>> getPriorities();

}
