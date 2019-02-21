package ru.greatbit.quack.storage;

import ru.greatbit.quack.beans.Attachment;
import ru.greatbit.whoru.auth.Session;

import java.io.IOException;
import java.io.InputStream;

public interface Storage {
    public Attachment upload(InputStream uploadedInputStream, String fileName, long size) throws IOException;
    public void remove(Attachment attachment) throws IOException;
    public InputStream get(Attachment attachment) throws IOException;
}
