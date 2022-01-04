package com.testquack.storage;

import com.testquack.beans.Attachment;

import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;

public class StubStorage implements Storage {
    @Override
    public Attachment upload(String organizationId, String projectId, InputStream uploadedInputStream, String fileName, long size) throws IOException {
        return new Attachment().withId(UUID.randomUUID().toString()).withTitle(fileName);
    }

    @Override
    public void remove(Attachment attachment) throws IOException {

    }

    @Override
    public InputStream get(Attachment attachment) throws IOException {
        return ClassLoader.getSystemResourceAsStream("/stubfile.txt");
    }
}
