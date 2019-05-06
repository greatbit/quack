#
# Quack TMS
#

# Pull base image.
FROM openjdk:8-jre-alpine

# Install NGINX
RUN apt-get update
RUN apt-get install nginx
COPY quack.cof /etc/nginx/sites-available
RUN ln -s /etc/nginx/sites-available /etc/nginx/sites-enabled
RUN nginx -s stop
RUN nginx

#Application
RUN mkdir -p /usr/quack
COPY assembly-*.war /usr/quack
COPY lib /usr/quack

#Configs
RUN mkdir -p /etc/quack
COPY classes/quack-properties /etc/quack

CMD ["java", "-Xbootclasspath/a:/etc/quack", "-jar", "/usr/quack/lib/jetty-runner.jar", "/usr/quack/assembly-*.war"]
