package ru.greatbit.quack.dal;

import org.springframework.data.repository.PagingAndSortingRepository;
import ru.greatbit.quack.beans.Attribute;

public interface AttributeRepository extends AttributeRepositoryCustom,
        PagingAndSortingRepository<Attribute, String>, CommonRepository<Attribute> {
}
