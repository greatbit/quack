package com.quack.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.quack.beans.User;
import com.quack.dal.CommonRepository;
import com.quack.dal.UserRepository;
import ru.greatbit.whoru.auth.Session;

import java.util.Collection;

@Service
public class UserService extends BaseService<User> {

    @Autowired
    private UserRepository repository;

    @Override
    protected CommonRepository<User> getRepository() {
        return repository;
    }

    @Override
    protected boolean userCanRead(Session session, String projectId, User entity) {
        return entity.getId().equals(session.getPerson().getId()) || session.isIsAdmin();
    }

    @Override
    protected boolean userCanSave(Session session, String projectId, User entity) {
        return entity.getId().equals(session.getPerson().getId()) || session.isIsAdmin();
    }

    @Override
    protected boolean userCanSave(Session session, String projectId, Collection<User> entities) {
        return session.isIsAdmin();
    }

    @Override
    protected boolean userCanDelete(Session session, String projectId, String id) {
        return id.equals(session.getPerson().getId()) || session.isIsAdmin();
    }

    @Override
    protected boolean userCanCreate(Session session, String projectId, User entity) {
        return session.isIsAdmin();
    }

    @Override
    protected boolean userCanUpdate(Session session, String projectId, User entity) {
        return entity.getId().equals(session.getPerson().getId()) || session.isIsAdmin();
    }
}
