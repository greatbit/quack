package com.testquack.services;

import com.testquack.beans.Entity;

public interface UpdatableEntityConvertor<E extends Entity> {
    public E transform(E originalEntity, E newEntity);
}
