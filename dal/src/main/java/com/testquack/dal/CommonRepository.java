package com.testquack.dal;

import com.testquack.beans.Filter;

import java.util.Collection;
import java.util.List;

public interface CommonRepository<E> {

    List<E> find(String organizationId, String projectId, Filter filter);

    long count(String organizationId, String projectId, Filter filter);

    E findOne(String organizationId, String projectId, String id);

    boolean exists(String organizationId, String projectId, String id);

    E save(String organizationId, String projectId, E entity);

    Collection<E> save(String organizationId, String projectId, Collection<E> entities);

    void delete(String organizationId, String projectId, String entityId);

    void delete(String organizationId, String projectId, Filter filter);
}
