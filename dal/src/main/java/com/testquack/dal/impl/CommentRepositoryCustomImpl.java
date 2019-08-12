package com.testquack.dal.impl;

import com.testquack.beans.Comment;
import com.testquack.beans.Launch;
import com.testquack.dal.CommentRepositoryCustom;

public class CommentRepositoryCustomImpl extends CommonRepositoryImpl<Launch>
        implements CommentRepositoryCustom {

    @Override
    public Class getEntityClass() {
        return Comment.class;
    }
}
