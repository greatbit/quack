package ru.greatbit.quack.tracker;

import ru.greatbit.quack.beans.Issue;
import ru.greatbit.quack.beans.IssuePriority;
import ru.greatbit.quack.beans.IssueType;
import ru.greatbit.quack.beans.Project;
import ru.greatbit.quack.beans.TrackerProject;
import ru.greatbit.whoru.auth.Session;
import sun.reflect.generics.reflectiveObjects.NotImplementedException;

import javax.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

public class DummyTracker implements Tracker {

    @Override
    public Issue getIssue(HttpServletRequest request, Session userSession, String issueId) {
        throw new NotImplementedException();
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
        throw new NotImplementedException();
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
}
