package com.testquack.storage;

import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.gridfs.GridFSBucket;
import com.mongodb.client.gridfs.GridFSBuckets;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.MongoDbFactory;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import com.testquack.beans.Attachment;

import java.io.IOException;
import java.io.InputStream;

public class MongoStorage implements Storage {

    @Autowired
    private GridFsTemplate gridOperations;

    @Autowired
    private MongoDatabaseFactory mongoDbFactory;

    @Override
    public Attachment upload(String organizationId, String projectId, InputStream uploadedInputStream, String fileName, long size) throws IOException {
        DBObject metaData = new BasicDBObject();
        metaData.put("name", fileName);
        try {
            ObjectId result = gridOperations.store(uploadedInputStream, fileName, "application/text", metaData);
            return new Attachment().withUrl(result.toString()).withDataSize(size).withTitle(fileName);
        } finally {
            if (uploadedInputStream != null) {
                uploadedInputStream.close();
            }
        }
    }

    @Override
    public void remove(Attachment attachment) throws IOException {
        gridOperations.delete(new Query().addCriteria(Criteria.where("_id").is(new ObjectId(attachment.getUrl()))));

    }

    @Override
    public InputStream get(Attachment attachment) throws IOException {
        com.mongodb.client.gridfs.model.GridFSFile file = gridOperations.findOne(
                new Query().addCriteria(Criteria.where("_id").is(new ObjectId(attachment.getUrl()))));
        if (file == null){
            throw new RuntimeException(String.format("File with id %s not found", attachment.getId()));
        } else {
            return new GridFsResource(file, getGridFs().openDownloadStream(file.getObjectId())).getInputStream();
        }
    }
    private GridFSBucket getGridFs() {
        MongoDatabase db = mongoDbFactory.getMongoDatabase();
        return GridFSBuckets.create(db);
    }
}
