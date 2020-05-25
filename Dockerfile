#
# Quack TMS
#

# Pull base image.
FROM openjdk:8u212-slim-stretch

#Application
RUN mkdir -p /usr/quack
COPY assembly/target/quack.war /usr/quack
COPY assembly/target/lib /usr/quack/lib

#Configs
RUN mkdir -p /etc/quack
COPY assembly/quack.properties /etc/quack

#UI
RUN mkdir -p /usr/quack/ui
COPY ui/src/build/ /usr/quack/ui

# Install NGINX
RUN apt-get update
RUN apt-get -y install nginx
RUN rm /etc/nginx/sites-enabled/default

COPY assembly/quack.conf /etc/nginx/sites-available
RUN ln -s /etc/nginx/sites-available/quack.conf /etc/nginx/sites-enabled/quack.conf
RUN nginx

#Startup
RUN mkdir -p /usr/quack/bin
COPY assembly/startup.sh /usr/quack/bin

EXPOSE 80
ENTRYPOINT ["sh", "/usr/quack/bin/startup.sh"]

