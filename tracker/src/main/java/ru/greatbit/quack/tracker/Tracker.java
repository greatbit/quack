package ru.greatbit.quack.tracker;

import ru.greatbit.quack.beans.Issue;
import ru.greatbit.whoru.auth.Session;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

public interface Tracker {

    Issue getIssue(HttpServletRequest request, Session userSession, String issueId);

    Issue createIssue(HttpServletRequest request, Session userSession, Issue issue);

    Issue linkIssue(HttpServletRequest request, Session userSession, String issueId);

    Issue updateIssue(HttpServletRequest request, Session userSession, Issue issue);

    void deleteIssue(HttpServletRequest request, Session userSession, String issueId);

    List<Issue> suggestIssue(HttpServletRequest request, Session userSession, String issueProject, String text);

}
