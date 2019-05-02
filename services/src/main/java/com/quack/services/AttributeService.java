package com.quack.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.quack.beans.Attribute;
import com.quack.dal.AttributeRepository;
import com.quack.dal.CommonRepository;

@Service
public class AttributeService extends BaseService<Attribute> {

    @Autowired
    private AttributeRepository repository;

    @Override
    protected CommonRepository<Attribute> getRepository() {
        return repository;
    }

}
