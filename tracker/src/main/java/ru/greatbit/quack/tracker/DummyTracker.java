package ru.greatbit.quack.tracker;

import ru.greatbit.quack.beans.Issue;
import ru.greatbit.whoru.auth.Session;
import sun.reflect.generics.reflectiveObjects.NotImplementedException;

import javax.servlet.http.HttpServletRequest;
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
    public Issue linkIssueById(HttpServletRequest request, Session userSession, String issueId) {
        return new Issue().withId(UUID.randomUUID().toString()).withTitle("Linked issue");
    }

    @Override
    public Issue linkIssueByUrl(HttpServletRequest request, Session userSession, String url) {
        return new Issue().withId(UUID.randomUUID().toString()).withTitle("Linked issue");
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
        return Collections.emptyList();
    }
}
