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
import ru.greatbit.whoru.auth.providers.CognitoAuthProvider;

import javax.servlet.http.HttpServletRequest;
import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

import static java.lang.String.format;
import static org.apache.commons.lang3.StringUtils.isEmpty;

@Service
public class OrgCognitoAuthProvider extends CognitoAuthProvider {


}
