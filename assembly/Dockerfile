#
# Quack TMS
#

# Pull base image.
FROM openjdk:8u212-slim-stretch

# Install NGINX
RUN apt-get update
RUN apt-get -y install nginx

COPY quack.conf /etc/nginx/sites-available
RUN ln -s /etc/nginx/sites-available/quack.conf /etc/nginx/sites-enabled/quack.conf
RUN nginx

#Application
RUN mkdir -p /usr/quack
COPY target/quack.war /usr/quack
COPY target/lib /usr/quack/lib

#Configs
RUN mkdir -p /etc/quack
COPY quack.properties /etc/quack

CMD ["java", "-Xbootclasspath/a:/etc/quack", "-jar", "/usr/quack/lib/jetty-runner.jar", "/usr/quack/quack.war"]
