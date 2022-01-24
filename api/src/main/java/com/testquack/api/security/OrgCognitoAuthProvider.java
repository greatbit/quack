package com.testquack.api.security;

import com.testquack.beans.Filter;
import com.testquack.beans.Organization;
import com.testquack.services.OrganizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import ru.greatbit.whoru.auth.Session;
import ru.greatbit.whoru.auth.providers.CognitoAuthProvider;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static com.testquack.services.BaseService.CURRENT_ORGANIZATION_KEY;
import static com.testquack.services.BaseService.ORGANIZATIONS_ENABLED_KEY;
import static com.testquack.services.BaseService.ORGANIZATIONS_KEY;
import static java.util.stream.Collectors.toList;
import static org.apache.commons.lang3.StringUtils.isEmpty;

@Service
public class OrgCognitoAuthProvider extends CognitoAuthProvider {

    public final static String ALL_IN_ORGANIZATION_GROUP = "All_Users";

    @Value("${quack.organizations.enabled}")
    private boolean ORGANIZATIONS_ENABLED;

    @Value("${google.analytics.enabled}")
    private boolean GOOGLE_ANALYTICS_ENABLED;

    public final static String ANALYTICS_ENALBED = "analyticsEnabled";

    private final int SUGGEST_LIMIT = 20;

    @Autowired
    private OrganizationService organizationService;

    @Override
    public Session doAuth(HttpServletRequest request, HttpServletResponse response) {
        Session session = super.doAuth(request, response);
        session.getMetainfo().put(ANALYTICS_ENALBED, GOOGLE_ANALYTICS_ENABLED);
        if (ORGANIZATIONS_ENABLED){
            session.getMetainfo().put(ORGANIZATIONS_ENABLED_KEY, true);
            
            List<Organization> organizations = organizationService.findFiltered(session, null, new Filter());
            session.getMetainfo().put(ORGANIZATIONS_KEY, organizations.stream().map(this::getShortOrganization).collect(toList()));
            if (organizations.size() == 1){
                session.getMetainfo().put(CURRENT_ORGANIZATION_KEY, organizations.get(0).getId());
            }
        }
        session.getPerson().getGroups().add(ALL_IN_ORGANIZATION_GROUP);
        sessionProvider.replaceSession(session);
        return session;
    }

    private Organization getShortOrganization(Organization organization) {
        return new Organization().withId(organization.getId()).withName(organization.getName());
    }

    @Override
    public Set<String> getAllUsers(HttpServletRequest request) {
        return new HashSet<>(Optional.ofNullable(getCurrentOrganizatio(request))
                .orElse(new Organization())
                .getAllowedUsers());
    }

    @Override
    public Set<String> suggestUser(HttpServletRequest request, String literal) {
        return getAllUsers(request).stream()
                .filter(Objects::nonNull)
                .filter(item -> isEmpty(literal) || item.contains(literal))
                .sorted()
                .limit(SUGGEST_LIMIT)
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    @Override
    public Set<String> getAllGroups(HttpServletRequest request) {
        return new HashSet<>(Optional.ofNullable(getCurrentOrganizatio(request))
                .orElse(new Organization())
                .getAllowedGroups());
    }

    @Override
    public Set<String> suggestGroups(HttpServletRequest request, String literal) {
        List<String> existingGroups = getAllGroups(request).stream()
                .filter(item -> isEmpty(literal) || item.contains(literal))
                .sorted()
                .limit(SUGGEST_LIMIT)
                .collect(Collectors.toList());
        Set<String> groups = new LinkedHashSet<>();
        groups.add(ALL_IN_ORGANIZATION_GROUP);
        groups.addAll(existingGroups);
        return groups;
    }

    private Organization getCurrentOrganizatio(HttpServletRequest request){
        Session session = getSession(request);
        String currentOrgId = organizationService.getCurrOrganizationId(session);
        return organizationService.findOne(session, null, currentOrgId);
    }
}
