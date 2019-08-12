package com.testquack.tracker;

import com.testquack.client.HttpClientBuilder;
import com.testquack.tracker.jira.IssuesSearchResults;
import com.testquack.tracker.jira.JiraField;
import com.testquack.tracker.jira.JiraIssue;
import com.testquack.tracker.jira.JiraProject;
import com.testquack.tracker.errors.TrackerValidationException;
import com.testquack.tracker.jira.CreateJiraIssue;
import org.springframework.beans.factory.annotation.Value;
import com.testquack.beans.Issue;
import com.testquack.beans.IssuePriority;
import com.testquack.beans.IssueType;
import com.testquack.beans.TrackerProject;
import com.testquack.tracker.jira.CreateJiraIssueFields;
import ru.greatbit.whoru.auth.Session;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import static java.lang.String.format;
import static java.util.stream.Collectors.toList;
import static org.springframework.util.StringUtils.isEmpty;

public class JiraTracker implements Tracker {

    @Value("${jira.api.endpoint}")
    private String jiraApiEndpoint;

    @Value("${jira.ui.endpoint}")
    private String jiraUiEndpoint;

    @Value("${jira.api.timeout}")
    private long jiraApiTimeout;

    private final String TRACKER_TYPE = "jira";


    @Override
    public Issue getIssue(HttpServletRequest request, Session userSession, String issueId) throws IOException {
        return convertIssue(getClient(request).getIssue(issueId).execute().body());
    }

    @Override
    public Issue createIssue(HttpServletRequest request, Session userSession, Issue issue) throws IOException {
        validateIssue(issue);
        JiraIssue emptyIssue = getClient(request).createIssue(convertToCreateIssue(issue)).execute().body();
        return getIssue(request, userSession, emptyIssue.getId());
    }


    @Override
    public Issue linkIssue(HttpServletRequest request, Session userSession, String issueId) throws IOException {
        return getIssue(request, userSession, issueId);
    }

    @Override
    public Issue updateIssue(HttpServletRequest request, Session userSession, Issue issue) {
        throw new UnsupportedOperationException("Jira Tracker does not allow to update issues");
    }

    @Override
    public void deleteIssue(HttpServletRequest request, Session userSession, String issueId) {
        throw new UnsupportedOperationException("Jira Tracker does not allow issues deletion");
    }

    @Override
    public List<Issue> suggestIssue(HttpServletRequest request, Session userSession, String issueProject, String text) throws IOException {
        IssuesSearchResults searchResults = getClient(request).suggestIssues(getSearchIssueJql(text)).execute().body();
        if (searchResults == null) {
            return Collections.emptyList();
        }
        return searchResults.getIssues().stream().map(this::convertIssue).collect(toList());
    }


    @Override
    public List<TrackerProject> suggestProjects(HttpServletRequest request, Session userSession, String project, String text) throws IOException {
        List<JiraProject> jiraProjects = getClient(request).getProjects().execute().body();
        if (jiraProjects == null) {
            return Collections.emptyList();
        }
        return jiraProjects.stream().map(this::convertProject).collect(toList());
    }

    @Override
    public List<IssueType> getIssueTypes(HttpServletRequest request, Session userSession, String issueProject) throws Exception {
        JiraProject jiraProject = getClient(request).getProject(issueProject).execute().body();
        if (jiraProject == null) {
            return Collections.emptyList();
        }
        return jiraProject.getIssueTypes().stream().
                map(this::convertIssueType).
                collect(toList());
    }

    private IssueType convertIssueType(JiraField jiraField) {
        return new IssueType(jiraField.getId(), jiraField.getName());
    }

    @Override
    public List<IssuePriority> getIssuePriorities(HttpServletRequest request, Session userSession, String issueProject) throws Exception {
        return getClient(request).getPriorities().execute().body().stream().map(this::convertPriority).collect(toList());
    }

    private IssuePriority convertPriority(JiraField jiraField) {
        return new IssuePriority(jiraField.getId(), jiraField.getName());
    }

    @Override
    public List<TrackerProject> getAllProjects(HttpServletRequest request, Session userSession, String project) throws Exception {
        return getClient(request).getProjects().execute().body().stream().map(this::convertProject).collect(Collectors.toList());
    }

    private JiraRestClient getClient(HttpServletRequest request) {
        return HttpClientBuilder.builder(jiraApiEndpoint, jiraApiTimeout, request).build().
                create(JiraRestClient.class);
    }

    private Issue convertIssue(JiraIssue jiraIssue) {
        return new Issue().withName(jiraIssue.getFields().getSummary()).
                withId(jiraIssue.getKey()).
                withDescription(jiraIssue.getFields().getDescription()).
                withIsClosed(isClosed(jiraIssue)).
                withPriority(convertPriority(jiraIssue.getFields().getPriority())).
                withStatus(jiraIssue.getFields().getStatus().getName()).
                withTrackerProject(
                        new TrackerProject().withId(jiraIssue.getFields().getProject().getKey()).
                                withName(jiraIssue.getFields().getProject().getName())
                ).
                withTrackerType(TRACKER_TYPE).
                withType(new IssueType(jiraIssue.getFields().getIssuetype().getId(), jiraIssue.getFields().getIssuetype().getName())).
                withUrl(getJiraIssueUrl(jiraIssue.getKey()));
    }

    private boolean isClosed(JiraIssue jiraIssue) {
        return jiraIssue.getFields().getResolution() != null;
    }

    private CreateJiraIssue convertToCreateIssue(Issue issue) {
        CreateJiraIssueFields fields = new CreateJiraIssueFields().
                withIssuetype(new JiraField().withId(issue.getType().getId())).
                withPriority(new JiraField().withId(issue.getPriority().getId())).
                withProject(new JiraField().withId(issue.getTrackerProject().getId())).
                withSummary(issue.getName()).
                withDescription(issue.getDescription());
        return new CreateJiraIssue().withName(issue.getName()).withFields(fields);
    }


    private String getJiraIssueUrl(String issueId) {
        return isEmpty(issueId) ? null : jiraUiEndpoint + "/browse/" + issueId;
    }

    private TrackerProject convertProject(JiraProject jiraProject) {
        return new TrackerProject().withId(jiraProject.getId()).
                withName(jiraProject.getName()).
                withUrl(jiraProject.getSelf());
    }

    private String getSearchIssueJql(String text) {
        return format("summary ~ \"%s\" OR " +
                        "description ~ \"%s\"",
                text, text);
    }

    private void validateIssue(Issue issue) {
        if (isEmpty(issue.getType())) {
            throw new TrackerValidationException("Issue type shouldn't be blank");
        }
        if (isEmpty(issue.getName())) {
            throw new TrackerValidationException("Issue name shouldn't be blank");
        }
        if (isEmpty(issue.getPriority())) {
            throw new TrackerValidationException("Issue priority shouldn't be blank");
        }
        if (isEmpty(issue.getTrackerProject())) {
            throw new TrackerValidationException("Issue project shouldn't be blank");
        }
    }
}
