package com.testquack.storage;

import com.testquack.beans.Attachment;

import java.io.IOException;
import java.io.InputStream;

public interface Storage {
    public Attachment upload(String organizationId, String projectId, InputStream uploadedInputStream, String fileName, long size) throws IOException;
    public void remove(Attachment attachment) throws IOException;
    public InputStream get(Attachment attachment) throws IOException;
}
