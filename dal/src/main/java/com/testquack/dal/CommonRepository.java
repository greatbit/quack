package com.testquack.dal;

import com.testquack.beans.Filter;

import java.util.Collection;
import java.util.List;

public interface CommonRepository<E> {

    List<E> find(String projectId, Filter filter);

    long count(String projectId, Filter filter);

    E findOne(String projectId, String id);

    boolean exists(String projectId, String id);

    E save(String projectId, E entity);

    Collection<E> save(String projectId, Collection<E> entities);

    void delete(String projectId, String entityId);
}
