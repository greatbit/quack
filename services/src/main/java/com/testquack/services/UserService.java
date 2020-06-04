package com.testquack.services;

import com.testquack.beans.Filter;
import com.testquack.services.errors.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.testquack.beans.User;
import com.testquack.dal.CommonRepository;
import com.testquack.dal.UserRepository;
import ru.greatbit.utils.string.StringUtils;
import ru.greatbit.whoru.auth.Session;

import java.security.NoSuchAlgorithmException;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static java.lang.String.format;
import static org.apache.commons.lang3.StringUtils.isEmpty;

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
        return true;
    }

    @Override
    protected boolean userCanSave(Session session, String projectId, User entity) {
        return session.isIsAdmin() || entity.getId().equals(session.getPerson().getId());
    }

    @Override
    protected boolean userCanSave(Session session, String projectId, Collection<User> entities) {
        return session.isIsAdmin();
    }

    @Override
    protected boolean userCanDelete(Session session, String projectId, String id) {
        return session.isIsAdmin() || id.equals(session.getPerson().getId());
    }

    @Override
    protected boolean userCanCreate(Session session, String projectId, User entity) {
        return session.isIsAdmin();
    }

    @Override
    protected boolean userCanUpdate(Session session, String projectId, User entity) {
        return session.isIsAdmin() || entity.getId().equals(session.getPerson().getId());
    }

    @Override
    public User findOne(Session session, String projectId, String id) {
        return cleanUserSesitiveData(super.findOne(session, projectId, id));
    }

    @Override
    protected void beforeCreate(Session session, String projectId, User user) {
        super.beforeCreate(session, projectId, user);
        if(exists(projectId, user.getLogin())){
            throw new RuntimeException(format("User with login %s already exists", user.getLogin()));
        }
        user.setId(user.getLogin());
        user.setPassword(encryptPassword(user.getPassword(), user.getLogin()));
    }

    @Override
    protected boolean validateEntity(User ent) {
        return !isEmpty(ent.getLogin());
    }

    public String encryptPassword(String password, String salt) {
        try {
            return StringUtils.getMd5String(password + salt);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    /////// Non-authenticable for internal usage

    public User findOne(Filter filter) {
        return repository.find(null, filter).stream().findFirst().orElseThrow(EntityNotFoundException::new);
    }

    public List<User> findAll() {
        return StreamSupport.stream(repository.findAll().spliterator(), false).collect(Collectors.toList());
    }

    public List<User> suggestUsers(String literal) {
        return repository.suggestUsers(literal);
    }


    private User cleanUserSesitiveData(User user){
        return user.withPassword(null).withToken(null);
    }

}
