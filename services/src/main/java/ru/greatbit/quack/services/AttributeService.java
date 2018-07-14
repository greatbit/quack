package ru.greatbit.quack.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.greatbit.quack.beans.Attribute;
import ru.greatbit.quack.dal.AttributeRepository;
import ru.greatbit.quack.dal.CommonRepository;

@Service
public class AttributeService extends BaseService<Attribute> {

    @Autowired
    private AttributeRepository repository;

    @Override
    protected CommonRepository<Attribute> getRepository() {
        return repository;
    }

}
