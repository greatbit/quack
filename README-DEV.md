Requirements:
Java 1.8 - 1.9
Maven
NodeJS
MongoDB
Nginx (Optionally)
Docker (Optionally)

Build
From the root folder:
mvn clean install 

Run api in IntellijIdea
1. Run mongo locally
If you want to store mongo data in a non-default folder - specify ```--datapath``` parameter
```sudo mongod --dbpath ~/mongo/data```
2. Add a Run/Debug configuration of a Maven type
Command line: ```jetty:run```
Working Directoyr: ```PATH_TO_THE_IDEA_PROJECTS_FOLDER/quack/api```
Runner tab - VM Options: ```-Xbootclasspath/a:/etc/quack``` 
(replace /etc/quack with the folder where you keep your local config file)
3. Put local config file to /etc/quack (or any other folder) - use the one as a reference api/main/resources/quack.properties
4. Configure Nginx somewhat like this
```
server {
    server_name .quack.com;
    listen [::]:80;
    listen 80;
    proxy_set_header Host $host;
    proxy_set_header Connection "";
        
    proxy_read_timeout     300;
    proxy_connect_timeout  300;
    proxy_http_version     1.1;

    gzip on;
    gzip_types      text/plain application/xml application/json;
    gzip_proxied    no-cache no-store private expired auth;
    gzip_min_length 1000;

    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    add_header Access-Control-Allow-Origin *;
    location / {
        proxy_pass http://localhost:3000/;
    }
    
    location /api {
        proxy_pass http://localhost:8089/api;
        access_log /var/log/nginx/access.log;
        error_log /var/log/nginx/error.log;
        proxy_redirect          off;
        proxy_connect_timeout   60s;
        add_header Access-Control-Allow-Methods "GET,PUT,OPTIONS,POST,DELETE";
        add_header Access-Control-Allow-Origin "*";
        add_header Access-Control-Allow-Headers "Content-Type";
        add_header Access-Control-Max-Age "86400";
        proxy_buffers 8 1024k;  
        proxy_buffer_size 1024k;
    }
    location = /favicon.ico {
        log_not_found off;
        access_log off;
    }

}
```
6. Run Nginx
```nginx```
7. Add aquack.com (or any other domain you are going to use locally) to your /etc/hosts
```127.0.0.1 quack.com```
8. Specify domain selected in p7 in your quack.properties as ```auth.domain```
9. Run api configured in p2 in Idea
10. Go to quack/ui/src and run 
```npm install```
```npm start```
11. Open quack.com in browser and login with admin credentials specified in your quack.properties
Default values are: 
```root:rootpass```


Build docker
From the root
docker build -t greatbit/quack .
or api only
docker build -t greatbit/quack-api -f Dockerfile-api .

docker tag IMAGE_ID greatbit/quack:latest
docker tag IMAGE_ID greatbit/quack:VERSION


Run API only with built-in Mongo and CORS enabled
docker-compose -f docker-compose-api.yml up
curl 'http://localhost:8080/api/user/login?login=somelogin&password=somepass'  -X 'POST'   -H 'Origin: http://quack123.com'  -H 'Referer: http://quack123.com/login'


Start Mongo locally with specific path to DB
sudo mongod --dbpath ~/mongo/data