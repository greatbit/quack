package com.testquack.dal;

import org.springframework.data.repository.PagingAndSortingRepository;
import com.testquack.beans.Attribute;

public interface AttributeRepository extends AttributeRepositoryCustom,
        PagingAndSortingRepository<Attribute, String>, CommonRepository<Attribute> {
}
