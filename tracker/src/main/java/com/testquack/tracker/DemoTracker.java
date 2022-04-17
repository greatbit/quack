package com.testquack.tracker;

import com.testquack.beans.Issue;
import com.testquack.beans.IssuePriority;
import com.testquack.beans.IssueType;
import com.testquack.beans.TrackerProject;
import ru.greatbit.whoru.auth.Session;

import javax.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

public class DemoTracker implements Tracker {

    @Override
    public Issue getIssue(HttpServletRequest request, Session userSession, String issueId) {
        throw new UnsupportedOperationException();
    }

    @Override
    public Issue createIssue(HttpServletRequest request, Session userSession, Issue issue) {
        return issue.withId(UUID.randomUUID().toString());
    }

    @Override
    public Issue linkIssue(HttpServletRequest request, Session userSession, String issueId) {
        return new Issue().withId(UUID.randomUUID().toString()).withName("Linked issue");
    }


    @Override
    public Issue updateIssue(HttpServletRequest request, Session userSession, Issue issue) {
        throw new UnsupportedOperationException();
    }

    @Override
    public void deleteIssue(HttpServletRequest request, Session userSession, String issueId) {
        //NOOP
    }

    @Override
    public List<Issue> suggestIssue(HttpServletRequest request, Session userSession, String issueProject, String text) {
        return Arrays.asList(
                new Issue().withId(UUID.randomUUID().toString()).withName("Issue-1"),
                new Issue().withId(UUID.randomUUID().toString()).withName("Issue-2"),
                new Issue().withId(UUID.randomUUID().toString()).withName("Issue-3")
        );
    }

    @Override
    public List<TrackerProject> suggestProjects(HttpServletRequest request, Session userSession, String project, String text) {
        return Collections.singletonList(new TrackerProject().withId("Issue").withName("Tracker Project Name"));
    }

    @Override
    public List<IssueType> getIssueTypes(HttpServletRequest request, Session userSession, String issueProject) throws Exception {
        return Arrays.asList(new IssueType("BUG", "Bug"), new IssueType("TASK", "Task"));
    }

    @Override
    public List<IssuePriority> getIssuePriorities(HttpServletRequest request, Session userSession, String issueProject) throws Exception {
        return Arrays.asList(new IssuePriority("HIGH", "High"), new IssuePriority("LOW", "Low"));
    }

    @Override
    public List<TrackerProject> getAllProjects(HttpServletRequest request, Session userSession, String project) throws Exception {
        return Arrays.asList(
                new TrackerProject().withId("Issue").withName("Tracker Project Name1"),
                new TrackerProject().withId("Issue2").withName("Tracker Project Name2")
        );
    }
}
