package ru.greatbit.quack.tracker;

import org.springframework.beans.factory.annotation.Value;
import ru.greatbit.quack.beans.Issue;
import ru.greatbit.quack.beans.IssuePriority;
import ru.greatbit.quack.beans.IssueType;
import ru.greatbit.quack.beans.TrackerProject;
import ru.greatbit.quack.tracker.jira.IssuesSearchResults;
import ru.greatbit.quack.tracker.jira.JiraField;
import ru.greatbit.quack.tracker.jira.JiraIssue;
import ru.greatbit.quack.tracker.jira.JiraProject;
import ru.greatbit.quack.tracker.jira.JiraProjectMeta;
import ru.greatbit.whoru.auth.Session;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

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
        return convertIssue(getClient(request).createIssue(convertIssue(issue)).execute().body());
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
        JiraProjectMeta jiraProjectMeta = getClient(request).getJiraProjectMeta(issueProject).execute().body();
        if (jiraProjectMeta == null) {
            return Collections.emptyList();
        }
        return jiraProjectMeta.getProjects().stream().
                flatMap(jiraProject -> jiraProject.getIssueTypes().stream()).
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
        return new Issue().withName(jiraIssue.getName()).withId(jiraIssue.getId()).
                withDescription(jiraIssue.getDescription()).
                withIsClosed(isClosed(jiraIssue)).
                withPriority(convertPriority(jiraIssue.getPriority())).
                withStatus(jiraIssue.getStatus().getName()).
                withTrackerProject(jiraIssue.getProject().getId()).
                withTrackerType(TRACKER_TYPE).
                withType(new IssueType(jiraIssue.getIssuetype().getId(), jiraIssue.getIssuetype().getName())).
                withUrl(jiraIssue.getSelf());
    }

    private boolean isClosed(JiraIssue jiraIssue) {
        //ToDo: implement
        return false;
    }

    private JiraIssue convertIssue(Issue issue) {
        return new JiraIssue().withId(issue.getId()).
                withDescription(issue.getDescription()).
                withIssuetype(new JiraField().withId((issue.getType().getId()))).
                withName(issue.getName()).
                withProject(new JiraProject().withId(issue.getTrackerProject())).
                withSelf(getJiraIssueUrl(issue));
    }

    private String getJiraIssueUrl(Issue issue) {
        return isEmpty(issue.getId()) ? null : jiraUiEndpoint + "projects/" + issue.getTrackerProject() +
                "/issues/" + issue.getId();
    }

    private TrackerProject convertProject(JiraProject jiraProject) {
        return null;
    }

    private String getSearchIssueJql(String text) {
        return null;
    }
}
