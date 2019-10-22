package com.testquack.services;

import com.testquack.beans.Event;
import com.testquack.dal.CommonRepository;
import com.testquack.dal.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EventService extends BaseService<Event> {

    @Autowired
    private EventRepository repository;

    @Override
    protected CommonRepository<Event> getRepository() {
        return repository;
    }


}
