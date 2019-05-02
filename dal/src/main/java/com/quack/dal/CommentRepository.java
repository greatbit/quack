package com.quack.dal;

import com.quack.beans.Comment;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface CommentRepository extends CommentRepositoryCustom,
        PagingAndSortingRepository<Comment, String>, CommonRepository<Comment> {
}
