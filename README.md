QuAck
==========

[![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/testquack/community)

[Task Board](https://app.gitkraken.com/glo/board/XGJXtidYzgAbYxz8)


QuAck is an open-source test management service. 
It allows to store testcases and test suites and execute them.

This web-based service is much different from other test management tools available on the market.

The main feature is that you don't have to stick to a specific test tree any more. You can rebuild the tree of testcases on the fly - it will be beased on testases attributes.

The service is built with integration patterns in mind. Pluggable architecuture allows to implement custom authentication providers, integrations with tracking and test executing systems.

Next versions of the service will allow users to analyze test runs, find gaps and bottle necks in their SDL process.

The usage of the service is free of charge.

Please note - the system is in active development state. Alpha version should be ready by the end of April 2019.

[More information on Wiki](https://github.com/greatbit/quack/wiki/QuAck)

How to run test server using docker
==========
1. Just run "docker-compose up" from the root folder of the project
2. Go to localhost in the browser

How to run on a standalone server
==========
1. Install NGINX and add conf/quack.conf
2. Run mongo, e.g.:
   mongo docker run --name mongodb --restart always -p 27017:27017 -d mongo
3. Place conf/quack.properties somewhere in the system (e.g. /etc/quack)
4. Override boot classpath when running -Xbootclasspath/a:/etc/quack
