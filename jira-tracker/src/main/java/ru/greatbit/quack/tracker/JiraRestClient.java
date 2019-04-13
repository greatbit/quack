package ru.greatbit.quack.tracker;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Path;
import retrofit2.http.Query;
import ru.greatbit.quack.tracker.jira.IssuesSearchResults;
import ru.greatbit.quack.tracker.jira.JiraField;
import ru.greatbit.quack.tracker.jira.JiraIssue;
import ru.greatbit.quack.tracker.jira.JiraProject;
import ru.greatbit.quack.tracker.jira.JiraProjectMeta;

import java.util.List;

public interface JiraRestClient {

    @GET("/issue/{issueIdOrKey}")
    Call<JiraIssue> getIssue(@Path("issueIdOrKey") String issueIdOrKey);

    @GET("project")
    Call<List<JiraProject>> getProjects();

    @POST
    Call<JiraIssue> createIssue(@Body JiraIssue jiraIssue);

    @GET
    Call<IssuesSearchResults> suggestIssues(@Query("jql") String jql);

    @GET("issue/createmeta?projectKeys=TEST")
    Call<JiraProjectMeta> getJiraProjectMeta(@Query("projectKeys") String project);

    @GET("priority")
    Call<List<JiraField>> getPriorities();

}
