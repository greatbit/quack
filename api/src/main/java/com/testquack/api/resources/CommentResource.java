package com.testquack.api.resources;

import com.testquack.beans.Comment;
import com.testquack.services.BaseService;
import org.springframework.beans.factory.annotation.Autowired;
import com.testquack.services.CommentService;
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
