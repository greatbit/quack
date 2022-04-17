package com.testquack.tracker;

import com.testquack.beans.Issue;
import com.testquack.beans.IssuePriority;
import com.testquack.beans.IssueType;
import com.testquack.beans.TrackerProject;
import ru.greatbit.whoru.auth.Session;

import javax.servlet.http.HttpServletRequest;
import java.util.Collections;
import java.util.List;

public class DummyTracker implements Tracker {

    @Override
    public Issue getIssue(HttpServletRequest request, Session userSession, String issueId) {
        return null;
    }

    @Override
    public Issue createIssue(HttpServletRequest request, Session userSession, Issue issue) {
        throw new RuntimeException("Tracker integration is not yet implemented");
    }

    @Override
    public Issue linkIssue(HttpServletRequest request, Session userSession, String issueId) {
        throw new RuntimeException("Tracker integration is not yet implemented");
    }


    @Override
    public Issue updateIssue(HttpServletRequest request, Session userSession, Issue issue) {
        return null;
    }

    @Override
    public void deleteIssue(HttpServletRequest request, Session userSession, String issueId) {
        //NOOP
    }

    @Override
    public List<Issue> suggestIssue(HttpServletRequest request, Session userSession, String issueProject, String text) {
        return Collections.emptyList();
    }

    @Override
    public List<TrackerProject> suggestProjects(HttpServletRequest request, Session userSession, String project, String text) {
        return Collections.emptyList();
    }

    @Override
    public List<IssueType> getIssueTypes(HttpServletRequest request, Session userSession, String issueProject) throws Exception {
        return Collections.emptyList();
    }

    @Override
    public List<IssuePriority> getIssuePriorities(HttpServletRequest request, Session userSession, String issueProject) throws Exception {
        return Collections.emptyList();
    }

    @Override
    public List<TrackerProject> getAllProjects(HttpServletRequest request, Session userSession, String project) throws Exception {
        return Collections.emptyList();
    }
}
