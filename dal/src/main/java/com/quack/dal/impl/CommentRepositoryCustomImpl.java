package com.quack.dal.impl;

import com.quack.beans.Comment;
import com.quack.beans.Launch;
import com.quack.dal.CommentRepositoryCustom;

public class CommentRepositoryCustomImpl extends CommonRepositoryImpl<Launch>
        implements CommentRepositoryCustom {

    @Override
    public Class getEntityClass() {
        return Comment.class;
    }
}
