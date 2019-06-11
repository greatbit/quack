FROM mongo

#Supervisod
RUN apt-get update && apt-get install -y supervisor
RUN mkdir -p /var/log/supervisord/
COPY supervisord.conf /etc/supervisor/conf.d

COPY test /tmp/test
RUN mkdir -p /usr/quack/exampledb
RUN mkdir -p /var/log/mongo

COPY mongod.conf /etc/mongod.conf

CMD ["/usr/bin/supervisord"]