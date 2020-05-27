package com.testquack.dal;

import com.mongodb.MongoClient;
import com.mongodb.MongoClientOptions;
import com.mongodb.ServerAddress;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoConfiguration;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static com.mongodb.MongoCredential.createCredential;
import static com.mongodb.internal.connection.ServerAddressHelper.createServerAddress;
import static org.apache.commons.lang3.StringUtils.isEmpty;

@Configuration
public class MongoConfig extends AbstractMongoConfiguration {

    @Value("${mongo.replicaSet}")
    String replicaSet;

    @Value("${mongo.dbname}")
    String dbname;

    @Value("${mongo.username}")
    String username;

    @Value("${mongo.password}")
    String password;

    @Override
    public MongoClient mongoClient() {
        MongoClientOptions clientOptions =
                MongoClientOptions.builder().
                        connectionsPerHost(40).
                        threadsAllowedToBlockForConnectionMultiplier(1000).
                        connectTimeout(15000).
                        socketTimeout(60000).
                        build();

        List<ServerAddress> addresses = Stream.of(replicaSet.split(",")).
                map(String::trim).
                map(host-> {
                    String[] tokens = host.split(":");
                    return tokens.length == 2 ?
                            createServerAddress(tokens[0], Integer.parseInt(tokens[1])) :
                            createServerAddress(host);

                }).
                collect(Collectors.toList());

        if (isEmpty(username)){
            return new MongoClient(addresses, clientOptions);
        }
        return new MongoClient(
                addresses,
                createCredential(username, dbname, password.toCharArray()),
                clientOptions
        );
    }

    @Override
    protected String getDatabaseName() {
        return dbname;
    }
}
