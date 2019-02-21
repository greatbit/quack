package ru.greatbit.quack.storage;

import ru.greatbit.quack.beans.Attachment;

import java.io.IOException;
import java.io.InputStream;

public class MongoStorage implements Storage {
    @Override
    public Attachment upload(InputStream uploadedInputStream, String fileName, long size) throws IOException {
        return null;
    }

    @Override
    public void remove(Attachment attachment) throws IOException {

    }

    @Override
    public InputStream get(Attachment attachment) throws IOException {
        return null;
    }
}
