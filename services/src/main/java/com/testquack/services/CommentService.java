package com.testquack.services;

import com.testquack.beans.Comment;
import com.testquack.dal.CommonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.testquack.dal.CommentRepository;
import ru.greatbit.whoru.auth.Session;

@Service
public class CommentService extends BaseService<Comment> {

    @Autowired
    private CommentRepository repository;

    @Override
    protected CommonRepository<Comment> getRepository() {
        return repository;
    }

    @Override
    protected void beforeSave(Session session, String projectId, Comment entity) {
        super.beforeSave(session, projectId, entity);
        entity.setTextFormatted(entity.getText());
    }

    @Override
    protected boolean userCanDelete(Session session, String projectId, String id) {
        Comment comment = findOne(session, projectId, id);
        return super.userCanDelete(session, projectId, id) || userIsTheOwner(session, comment);
    }

    @Override
    protected boolean userCanUpdate(Session session, String projectId, Comment entity) {
        return super.userCanUpdate(session, projectId, entity) || userIsTheOwner(session, entity);
    }

    private boolean userIsTheOwner(Session session, Comment comment) {
        return session.getPerson().getLogin().equals(comment.getCreatedBy());
    }

}
