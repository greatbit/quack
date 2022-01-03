package com.testquack.api.security;

import com.hazelcast.config.MapConfig;
import com.hazelcast.core.EntryEvent;
import com.hazelcast.map.IMap;
import com.hazelcast.map.listener.EntryEvictedListener;
import com.hazelcast.map.listener.EntryRemovedListener;
import com.testquack.api.errors.LicenseCapacityReachedException;
import com.testquack.beans.Organization;
import com.testquack.dal.OrganizationRepository;
import com.testquack.services.errors.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import ru.greatbit.whoru.auth.Session;
import ru.greatbit.whoru.auth.providers.HazelcastSessionProvider;

import javax.annotation.PostConstruct;

import static com.testquack.services.BaseService.CURRENT_ORGANIZATION_KEY;

public class OrgHazelcastSessionProvider extends HazelcastSessionProvider {

    @Value("${quack.organizations.enabled}")
    protected boolean organizationsEnabled;

    @Value("${auth.session.ttl}")
    protected int sessionTTLSec;

    private final static String ORG_SESSION_COUNTER_MAP = "org_session_counter";

    @Autowired
    private OrganizationRepository organizationRepository;

    @PostConstruct
    public void init(){
        MapConfig sessionMapConfig = new MapConfig(getMap().getName()).setTimeToLiveSeconds(sessionTTLSec);
        getInstance().getConfig().addMapConfig(sessionMapConfig);

        getMap().addLocalEntryListener(new HazelcastSessionListener());

        MapConfig sessionCounterMapConfig = new MapConfig(ORG_SESSION_COUNTER_MAP);
        getInstance().getConfig().addMapConfig(sessionCounterMapConfig);
    }

    private int countSessionsByOrganization(String organizationId){
        IMap<String, Integer> sessionsCounterMap = getInstance().getMap(ORG_SESSION_COUNTER_MAP);
        sessionsCounterMap.putIfAbsent(organizationId, 0);
        return sessionsCounterMap.get(organizationId);
    }

    @Override
    public void addSession(Session session) {
        checkSessionsCapacity(session);
        updateSessionCounter(session, 1);
        super.addSession(session);
    }

    @Override
    public void replaceSession(Session session) {
        updateSessionCounter(getMap().get(session.getId()), -1);
        super.replaceSession(session);
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

    private void updateSessionCounter(Session session, int count){
        if (organizationsEnabled && session != null && getOrganizationId(session) != null){
            int prevCounter = (int) getInstance().getMap(ORG_SESSION_COUNTER_MAP).get(getOrganizationId(session));
            getInstance().getMap(ORG_SESSION_COUNTER_MAP).put(getOrganizationId(session), Math.max(0, prevCounter + count));
        }
    }


    public class HazelcastSessionListener implements EntryRemovedListener<String, Session>,
            EntryEvictedListener<String, Session> {

        @Override
        public void entryEvicted(EntryEvent<String, Session> entryEvent) {
            updateSessionCounter(entryEvent.getOldValue(), -1);
        }

        @Override
        public void entryRemoved(EntryEvent<String, Session> entryEvent) {
            updateSessionCounter(entryEvent.getOldValue(), -1);
        }

    }

}
