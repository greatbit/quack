package com.testquack.api.security;

import com.testquack.beans.Filter;
import com.testquack.beans.User;
import com.testquack.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.greatbit.whoru.auth.Person;
import ru.greatbit.whoru.auth.RedirectResponse;
import ru.greatbit.whoru.auth.error.UnauthorizedException;
import ru.greatbit.whoru.auth.providers.BaseDbAuthProvider;

import javax.servlet.http.HttpServletRequest;
import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

import static java.lang.String.format;
import static java.util.Collections.emptySet;
import static org.apache.commons.lang3.StringUtils.isEmpty;
import static ru.greatbit.utils.string.StringUtils.emptyIfNull;

@Service
public class DbAuthProvider extends BaseDbAuthProvider {

    @Autowired
    private UserService userService;

    @Override
    protected Person getAdminPerson(String token) {
        return null;
    }

    @Override
    protected Person getAdminPerson(String login, String password) {
        if (!isEmpty(login) && !isEmpty(password) && login.equals(adminLogin) && password.equals(adminPassword)){
            return new Person().withLogin(adminLogin).withFirstName("admin");
        }
        throw new UnauthorizedException();
    }

    @Override
    protected Person findPersonByApiToken(String token) {
        if (!isEmpty(token) && token.equals(adminToken)){
            return new Person().withLogin(adminLogin).withFirstName("admin");
        }
        throw new UnauthorizedException();
    }

    @Override
    protected Person findPersonByLogin(String login) {
        return convertUser(userService.findOne(null, new Filter().withField("login", login)));
    }

    @Override
    public Set<String> suggestGroups(HttpServletRequest request, String literal) {
        return emptySet();
    }

    @Override
    public Set<String> getAllUsers(HttpServletRequest request) {
        return userService.findAll().stream().
                map(User::getLogin).
                collect(Collectors.toSet());
    }

    @Override
    public Set<String> suggestUser(HttpServletRequest request, String literal) {
        if (isEmpty(literal)) return emptySet();
        return userService.suggestUsers(null, literal).stream().
                map(user -> format("%s:%s %s", user.getId(), user.getFirstName(), user.getLastName())).
                collect(Collectors.toSet());
    }

    @Override
    public RedirectResponse redirectChangePasswordTo(HttpServletRequest request) {
        String login = emptyIfNull(request.getParameter("login"));
        return new RedirectResponse(changePasswordUrl + "/" + login, "retpath", false);
    }

    @Override
    public RedirectResponse redirectNotAuthTo(HttpServletRequest request) {
        return new RedirectResponse("/login", "retpath", false);
    }

    private Person convertUser(User user){
        return new Person().withFirstName(user.getFirstName()).
                withLastName(user.getLastName()).
                withLogin(user.getLogin()).
                withActive(true).
                withDefaultPassword(user.isPasswordChangeRequired()).
                withPassword(user.getPassword());
    }
}
