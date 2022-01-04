package com.testquack.storage;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Value;
import com.testquack.beans.Attachment;

import java.io.*;
import java.util.UUID;

public class LocalStorage implements Storage {

    @Value("${storage.base_path}")
    private String STORAGE_BASE_PATH;

    @Override
    public Attachment upload(String organizationId, String projectId, InputStream uploadedInputStream, String fileName, long size) throws IOException {
        File file = new File(STORAGE_BASE_PATH + File.separator + UUID.randomUUID().toString(), fileName);
        file.getParentFile().mkdirs();
        OutputStream os = new FileOutputStream(file);
        long len = IOUtils.copy(uploadedInputStream, os);
        IOUtils.closeQuietly(os);
        return new Attachment().withUrl(file.getAbsolutePath()).withDataSize(len);
    }

    @Override
    public void remove(Attachment attachment) throws IOException {
        File f = new File(attachment.getUrl());
        FileUtils.deleteQuietly(f);
    }

    @Override
    public InputStream get(Attachment attachment) throws IOException {
        return new FileInputStream(attachment.getUrl());
    }

}
