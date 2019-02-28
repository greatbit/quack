package ru.greatbit.quack.services;

import ru.greatbit.quack.beans.Entity;

public interface UpdatableEntityConvertor<E extends Entity> {
    public E transform(E originalEntity, E newEntity);
}
