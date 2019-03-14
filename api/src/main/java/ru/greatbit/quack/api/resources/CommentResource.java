package ru.greatbit.quack.api.resources;

import org.springframework.beans.factory.annotation.Autowired;
import ru.greatbit.quack.beans.Comment;
import ru.greatbit.quack.services.BaseService;
import ru.greatbit.quack.services.CommentService;
import ru.greatbit.whoru.jaxrs.Authenticable;

import javax.ws.rs.Path;

@Authenticable
@Path("/{projectId}/comment")
public class CommentResource extends BaseCrudResource<Comment> {

    @Autowired
    private CommentService service;

    @Override
    protected BaseService<Comment> getService() {
        return service;
    }


}
