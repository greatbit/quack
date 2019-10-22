package com.testquack.dal.impl;

import com.testquack.beans.Event;
import com.testquack.dal.EventRepositoryCustom;

public class EventRepositoryCustomImpl extends CommonRepositoryImpl<Event>
        implements EventRepositoryCustom {

    @Override
    public Class getEntityClass() {
        return Event.class;
    }

}
