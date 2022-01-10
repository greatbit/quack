package com.testquack.services;

import com.hazelcast.core.HazelcastInstance;
import com.hazelcast.cp.lock.FencedLock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.testquack.beans.Sequencer;
import com.testquack.dal.SequencerRepository;

import java.util.concurrent.TimeUnit;

import static java.lang.String.format;
import static org.apache.commons.lang3.StringUtils.isEmpty;

@Service
public class SequencerService {

    @Autowired
    private HazelcastInstance hazelcastInstance;

    @Autowired
    private SequencerRepository repository;

    private final long LOCK_TTL = 5;

    public Sequencer create(String organizationId, String projectId){
        String sequencerId = getSquencerId(organizationId, projectId);
        FencedLock lock = hazelcastInstance.getCPSubsystem().getLock(getLockId(sequencerId));
        lock.tryLock(LOCK_TTL, TimeUnit.MINUTES);
        try {
            return repository.save(new Sequencer().withId(sequencerId));
        } finally {
            lock.unlock();
        }
    }

    public Sequencer increment(String organizationId, String projectId){
        String sequencerId = getSquencerId(organizationId, projectId);
        FencedLock lock = hazelcastInstance.getCPSubsystem().getLock(getLockId(sequencerId));
        lock.tryLock(LOCK_TTL, TimeUnit.MINUTES);
        try {
            Sequencer sequencer = repository.findById(sequencerId).orElse(new Sequencer().withId(sequencerId));
            sequencer.setIndex(sequencer.getIndex() + 1);
            return repository.save(sequencer);
        } finally {
            lock.unlock();
        }
    }

    private String getLockId(String projectId){
        return format("sequencer-%s", projectId);
    }

    private String getSquencerId(String organizationId, String projectId) {
        return isEmpty(organizationId) ? projectId : organizationId + "_" + projectId;
    }
}
