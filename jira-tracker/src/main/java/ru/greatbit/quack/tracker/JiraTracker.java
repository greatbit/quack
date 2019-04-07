package ru.greatbit.quack.tracker;

import ru.greatbit.quack.beans.Issue;
import ru.greatbit.whoru.auth.Session;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

public class JiraTracker implements Tracker {
    @Override
    public Issue getIssue(HttpServletRequest request, Session userSession, String issueId) {
        return null;
    }

    @Override
    public Issue createIssue(HttpServletRequest request, Session userSession, Issue issue) {
        return null;
    }

    @Override
    public Issue linkIssue(HttpServletRequest request, Session userSession, String issueId) {
        return null;
    }

    @Override
    public Issue updateIssue(HttpServletRequest request, Session userSession, Issue issue) {
        return null;
    }

    @Override
    public void deleteIssue(HttpServletRequest request, Session userSession, String issueId) {

    }

    @Override
    public List<Issue> suggestIssue(HttpServletRequest request, Session userSession, String issueProject, String text) {
        return null;
    }

    @Override
    public List<String> suggestProjects(HttpServletRequest request, Session userSession, String project, String text) {
        return null;
    }

}
