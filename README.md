1. Install NGINX and add conf/quack.conf
2. Run mongo docker run --name mongodb --restart always -p 27017:27017 -d mongo
3. Place conf/quack.properties somewhere in the system (e.g. /etc/quack)
4. Override boot classpath when running -Xbootclasspath/a:/etc/quack
