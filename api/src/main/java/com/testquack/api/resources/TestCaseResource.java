package com.testquack.api.resources;

import com.testquack.beans.Attachment;
import com.testquack.beans.Filter;
import com.testquack.beans.Issue;
import com.testquack.beans.IssuePriority;
import com.testquack.beans.IssueType;
import com.testquack.beans.TestCase;
import com.testquack.beans.TestCaseTree;
import com.testquack.beans.TestcaseFilter;
import com.testquack.beans.TrackerProject;
import com.testquack.services.BaseService;
import com.testquack.services.TestCaseService;
import com.testquack.services.errors.EntityValidationException;
import io.swagger.annotations.ApiParam;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import ru.greatbit.whoru.jaxrs.Authenticable;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;

import static java.lang.String.format;
import static javax.ws.rs.core.Response.serverError;

@Authenticable
@Path("/{projectId}/testcase")
public class TestCaseResource extends BaseCrudResource<TestCase> {

    @Autowired
    private TestCaseService service;

    @Override
    protected BaseService<TestCase> getService() {
        return service;
    }

    @Override
    protected Filter initFilter(HttpServletRequest hsr) {
        TestcaseFilter filter = new TestcaseFilter(super.initFilter(hsr));
        if(hsr.getParameterValues("groups") != null){
            filter.getGroups().addAll(Arrays.asList(hsr.getParameterValues("groups")));
        }
        if (filter.getFields().containsKey("groups")){
            filter.getFields().remove("groups");
        }
        
        return filter;
    }

    @GET
    @Path("/tree")
    public TestCaseTree findFilteredTree(@ApiParam(value = "Project Id", required = true) @PathParam("projectId") String projectId) {
        return service.findFilteredTree(getUserSession(), projectId, (TestcaseFilter) initFilter(request));
    }

    @POST
    @Path("/{testcaseId}/attachment")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public TestCase upload(@FormDataParam("file") InputStream uploadedInputStream,
                              @FormDataParam("file") FormDataContentDisposition fileDetail,
                              @FormDataParam("size") long size,
                              @PathParam("projectId") String projectId,
                              @PathParam("testcaseId") String testcaseId) throws IOException {
        if (fileDetail == null) {
            throw new EntityValidationException();
        }
        return service.uploadAttachment(getUserSession(), projectId, testcaseId,
                uploadedInputStream, fileDetail.getFileName(), fileDetail.getSize());
    }

    @GET
    @Path("/{testcaseId}/attachment/{attachmentId}")
    public Response downloadAttachment(
            @PathParam("projectId") String projectId,
            @PathParam("testcaseId") final String testcaseId,
            @PathParam("attachmentId") final String attachmentId) {
        Attachment attachment = service.getAttachment(getUserSession(), projectId, testcaseId, attachmentId);
        try {
            return Response
                    .ok(service.getAttachmentStream(attachment), MediaType.APPLICATION_OCTET_STREAM)
                    .header("content-disposition", format("attachment; filename = %s", attachment.getTitle()))
                    .build();
        } catch (IOException ioexp) {
            return serverError().build();
        }
    }

    @DELETE
    @Path("/{testcaseId}/attachment/{attachmentId}")
    public TestCase deleteAttachment(
            @PathParam("projectId") String projectId,
            @PathParam("testcaseId") final String testcaseId,
            @PathParam("attachmentId") final String attachmentId) throws IOException {
        return service.deleteAttachment(getUserSession(), projectId, testcaseId, attachmentId);
    }

    @POST
    @Path("/{testcaseId}/issue")
    public TestCase createIssue(@PathParam("projectId") String projectId,
                                @PathParam("testcaseId") final String testcaseId,
                                @RequestBody Issue issue) throws Exception {
        return service.createIssue(request, getUserSession(), projectId, testcaseId, issue);
    }

    @POST
    @Path("/{testcaseId}/issue/link/{issueId}")
    public TestCase linkIssueById(@PathParam("projectId") String projectId,
                                  @PathParam("testcaseId") final String testcaseId,
                                  @PathParam("issueId") final String issueId) throws Exception {
        return service.linkIssue(request, getUserSession(), projectId, testcaseId, issueId);
    }


    @DELETE
    @Path("/{testcaseId}/issue/{issueId}")
    public TestCase unlinkIssue(@PathParam("projectId") String projectId,
                                @PathParam("testcaseId") final String testcaseId,
                                @PathParam("issueId") final String issueId) {
        return service.unlinkIssue(request, getUserSession(), projectId, testcaseId, issueId);
    }

    @GET
    @Path("/issue/{issueId}")
    public Issue getIssue(@PathParam("issueId") String issueId) throws Exception {
        return service.getIssue(request, getUserSession(), issueId);
    }

    @GET
    @Path("/issue/suggest")
    public List<Issue> suggestIssue(@PathParam("projectId") String projectId,
                                    @QueryParam("text") String text) throws Exception {
        return service.suggestIssue(request, getUserSession(), projectId, text);
    }

    @GET
    @Path("/issue/projects/suggest")
    public List<TrackerProject> suggestProjects(@PathParam("projectId") String projectId,
                                                @QueryParam("text") String text) throws Exception {
        return service.suggestProjects(request, getUserSession(), projectId, text);
    }

    @GET
    @Path("/issue/projects")
    public List<TrackerProject> getProjects(@PathParam("projectId") String projectId) throws Exception {
        return service.getAllProjects(request, getUserSession(), projectId);
    }

    @GET
    @Path("/issue/types")
    public List<IssueType> getIssueTypes(@PathParam("projectId") String projectId,
                                         @QueryParam("project") String issueProjectId) throws Exception {
        return service.getIssueTypes(request, getUserSession(), issueProjectId);
    }

    @GET
    @Path("/issue/priorities")
    public List<IssuePriority> getIssuePriorities(@PathParam("projectId") String projectId,
                                                  @QueryParam("project") String issueProjectId) throws Exception {
        return service.getIssuePriorities(request, getUserSession(), issueProjectId);
    }

    @POST
    @Path("/import")
    public List<TestCase> importTestCases(@PathParam("projectId") String projectId,
                                          @RequestBody List<TestCase> testCases) {
        return service.importTestCases(getUserSession(), projectId, testCases);
    }

    @POST
    @Path("/{testcaseId}/clone")
    public TestCase cloneTestCase(@PathParam("projectId") String projectId,
                                  @PathParam("testcaseId") final String testcaseId) {
        return service.cloneTestCase(getUserSession(), projectId, testcaseId);
    }

    @GET
    @Path("/csv")
    public Response exportToCSV(@ApiParam(value = "Project Id", required = true) @PathParam("projectId") String projectId) {
        return Response
                .ok(service.exportToCSV(getUserSession(), projectId, (TestcaseFilter) initFilter(request)), MediaType.APPLICATION_OCTET_STREAM)
                .header("content-disposition", format("attachment; filename = %s", "testcases.csv"))
                .build();
    }
}
