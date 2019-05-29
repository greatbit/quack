FROM mongo

COPY test /tmp/test
RUN mkdir -p /usr/quack/exampledb
COPY startup.sh /usr/quack/exampledb
ENTRYPOINT ["sh", "/usr/quack/exampledb/startup.sh"]