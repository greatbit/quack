package com.testquack.dal;

import com.testquack.beans.Event;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface EventRepository extends EventRepositoryCustom,
        PagingAndSortingRepository<Event, String>, CommonRepository<Event> {
}
