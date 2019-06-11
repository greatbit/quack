QuAck
==========

[![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/testquack/community)

QuAck is an open-source test management service. 
It allows to store testcases and test suites and execute them.

This web-based service is much different from other test management tools available on the market.

The main feature is that you don't have to stick to a specific test tree any more. You can rebuild the tree of testcases on the fly - it will be beased on testases attributes.

The service is built with integration patterns in mind. Pluggable architecuture allows to implement custom authentication providers, integrations with tracking and test executing systems.

The usage of the service is free of charge.

[More information on Wiki](https://github.com/greatbit/quack/wiki/QuAck)

#### Test Cases Tree and Filter
![Test Cases Tree](https://raw.githubusercontent.com/greatbit/greatbit.github.io/master/quack/img/tree-800.png)

#### Test Launch
![Test Launch](https://raw.githubusercontent.com/greatbit/greatbit.github.io/master/quack/img/launch-800.png)

#### Test Launches
![Launches](https://raw.githubusercontent.com/greatbit/greatbit.github.io/master/quack/img/launches-800.png)

#### Statistics
![Statistics](https://raw.githubusercontent.com/greatbit/greatbit.github.io/master/quack/img/stats-800.png)

How to run test server using docker
==========
1. Just run "docker-compose up" from the root folder of the project
or
   "docker-compose -f docker-compose-demo.yml up" for QuAck with demo data
2. Go to localhost in the browser
3. Use following credentials: "root:rootpass" for admin and "somelogin:somepass" for a regular user

How to run on a standalone server
==========
1. Install NGINX and add [conf/quack.conf](https://github.com/greatbit/quack/blob/master/assembly/quack.conf)
2. Run mongo, e.g.:
   mongo docker run --name mongodb --restart always -p 27017:27017 -d mongo
3. Place [conf/quack.properties](https://github.com/greatbit/quack/blob/master/assembly/quack.properties) somewhere in the system (e.g. /etc/quack)
4. Override boot classpath when running -Xbootclasspath/a:/etc/quack
e.g., starting war using jetty-runner:
java -Xbootclasspath/a:/etc/quack -jar /usr/quack/lib/jetty-runner.jar /usr/quack/quack.war
