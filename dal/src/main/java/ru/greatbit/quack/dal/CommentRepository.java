package ru.greatbit.quack.dal;

import org.springframework.data.repository.PagingAndSortingRepository;
import ru.greatbit.quack.beans.Comment;

public interface CommentRepository extends CommentRepositoryCustom,
        PagingAndSortingRepository<Comment, String>, CommonRepository<Comment> {
}
