package com.quack.services;

import com.quack.beans.Entity;

public interface UpdatableEntityConvertor<E extends Entity> {
    public E transform(E originalEntity, E newEntity);
}
