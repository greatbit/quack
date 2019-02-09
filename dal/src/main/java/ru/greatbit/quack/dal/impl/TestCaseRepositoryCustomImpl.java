package ru.greatbit.quack.dal.impl;

import org.springframework.data.mongodb.core.query.Query;
import ru.greatbit.quack.beans.Filter;
import ru.greatbit.quack.beans.TestCase;
import ru.greatbit.quack.beans.TestcaseFilter;
import ru.greatbit.quack.dal.TestCaseRepositoryCustom;

public class TestCaseRepositoryCustomImpl extends CommonRepositoryImpl<TestCase>
        implements TestCaseRepositoryCustom {

    @Override
    public Class getEntityClass() {
        return TestCase.class;
    }

    @Override
    protected Query getQuery(Filter filter) {
        Query query = super.getQuery(filter);
        //ToDO - implement
        return query;
    }
}
