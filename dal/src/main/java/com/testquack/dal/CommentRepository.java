package com.testquack.dal;

import com.testquack.beans.Comment;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface CommentRepository extends CommentRepositoryCustom,
        PagingAndSortingRepository<Comment, String>, CommonRepository<Comment> {
}
