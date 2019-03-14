package ru.greatbit.quack.dal.impl;

import ru.greatbit.quack.beans.Comment;
import ru.greatbit.quack.beans.Launch;
import ru.greatbit.quack.dal.AttributeRepositoryCustom;
import ru.greatbit.quack.dal.CommentRepositoryCustom;

public class CommentRepositoryCustomImpl extends CommonRepositoryImpl<Launch>
        implements CommentRepositoryCustom {

    @Override
    public Class getEntityClass() {
        return Comment.class;
    }
}
