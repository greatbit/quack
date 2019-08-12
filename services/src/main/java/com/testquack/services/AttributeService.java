package com.testquack.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.testquack.beans.Attribute;
import com.testquack.dal.AttributeRepository;
import com.testquack.dal.CommonRepository;

@Service
public class AttributeService extends BaseService<Attribute> {

    @Autowired
    private AttributeRepository repository;

    @Override
    protected CommonRepository<Attribute> getRepository() {
        return repository;
    }

}
