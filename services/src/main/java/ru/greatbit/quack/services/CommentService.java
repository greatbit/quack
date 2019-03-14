package ru.greatbit.quack.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.greatbit.quack.beans.Comment;
import ru.greatbit.quack.dal.CommentRepository;
import ru.greatbit.quack.dal.CommonRepository;
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
    protected void beforeSave(Session session, Comment entity) {
        super.beforeSave(session, entity);
        entity.setTextFormatted(entity.getText());
    }
}
