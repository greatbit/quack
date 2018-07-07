package ru.greatbit.quack.dal;

import ru.greatbit.quack.beans.Filter;

import java.util.List;

public interface CommonRepository<E> {

    List<E> find(String projectId, Filter filter, int skip, int limit);

    E save(String projectId, E entity);

    void delete(String projectId, String entityId);
}
