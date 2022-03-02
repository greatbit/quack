package com.testquack.api.security;

import com.hazelcast.config.MapConfig;
import com.testquack.api.errors.LicenseCapacityReachedException;
import com.testquack.beans.Organization;
import com.testquack.dal.OrganizationRepository;
import com.testquack.services.errors.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import ru.greatbit.whoru.auth.Session;
import ru.greatbit.whoru.auth.SessionProvider;
import ru.greatbit.whoru.auth.providers.HazelcastSessionProvider;

import javax.annotation.PostConstruct;

import java.util.Objects;

import static com.testquack.services.BaseService.CURRENT_ORGANIZATION_KEY;

public class OrgHazelcastSessionProvider extends HazelcastSessionProvider {

    @Value("${quack.organizations.enabled}")
    protected boolean organizationsEnabled;

    @Value("${auth.session.ttl}")
    protected int sessionTTLSec;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private SessionProvider sessionProvider;

    @PostConstruct
    public void init(){
        MapConfig sessionMapConfig = new MapConfig(getMap().getName()).setTimeToLiveSeconds(sessionTTLSec);
        getInstance().getConfig().addMapConfig(sessionMapConfig);
    }

    private long countSessionsByOrganization(String organizationId){
        return sessionProvider.getAllSessions().values().stream()
                .map(this::getOrganizationId)
                .filter(Objects::nonNull)
                .filter(sessionOrgId -> sessionOrgId.equals(organizationId))
                .count();
    }

    @Override
    public void addSession(Session session) {
        checkSessionsCapacity(session);
        super.addSession(session);
    }

    private void checkSessionsCapacity(Session session){
        if (!organizationsEnabled) return;

        String orgId = getOrganizationId(session);
        if (orgId == null) return;

        Organization organization = organizationRepository.findOne(null, null, orgId);
        if (organization == null){
            throw new EntityNotFoundException("Organization " + orgId + " does not exist");
        }

        if (countSessionsByOrganization(orgId) + 1 > organization.getLicenseCapacity()){
            throw new LicenseCapacityReachedException("Number of available sessions exceeded the limit of " + organization.getLicenseCapacity() +
                    "\n Please log out or purchase more sessions");
        }
    }

    private String getOrganizationId(Session session){
        return (String) session.getMetainfo().get(CURRENT_ORGANIZATION_KEY);
    }

}
