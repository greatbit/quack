package com.quack.dal;

import org.springframework.data.repository.PagingAndSortingRepository;
import com.quack.beans.Attribute;

public interface AttributeRepository extends AttributeRepositoryCustom,
        PagingAndSortingRepository<Attribute, String>, CommonRepository<Attribute> {
}
