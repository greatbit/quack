package com.testquack.api.security;

import com.testquack.beans.Filter;
import com.testquack.beans.Organization;
import com.testquack.dal.OrganizationRepository;
import com.testquack.services.OrganizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import ru.greatbit.whoru.auth.Session;
import ru.greatbit.whoru.auth.providers.CognitoAuthProvider;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.util.List;

import static com.testquack.services.BaseService.CURRENT_ORGANIZATION_KEY;
import static com.testquack.services.BaseService.ORGANIZATIONS_ENABLED_KEY;
import static com.testquack.services.BaseService.ORGANIZATIONS_KEY;
import static java.util.stream.Collectors.toList;

@Service
public class OrgCognitoAuthProvider extends CognitoAuthProvider {

    @Value("${quack.organizations.enabled}")
    private boolean ORGANIZATIONS_ENABLED;

    @Autowired
    private OrganizationService organizationService;

    @Override
    public Session doAuth(HttpServletRequest request, HttpServletResponse response) {
        Session session = super.doAuth(request, response);
        if (ORGANIZATIONS_ENABLED){
            session.getMetainfo().put(ORGANIZATIONS_ENABLED_KEY, true);
            
            List<Organization> organizations = organizationService.findFiltered(session, null, new Filter());
            session.getMetainfo().put(ORGANIZATIONS_KEY, organizations.stream().map(this::getShortOrganization).collect(toList()));
            if (organizations.size() == 1){
                session.getMetainfo().put(CURRENT_ORGANIZATION_KEY, organizations.get(0).getId());
            }
        }
        sessionProvider.replaceSession(session);
        return session;
    }

    private Organization getShortOrganization(Organization organization) {
        return new Organization().withId(organization.getId()).withName(organization.getName());
    }
}
