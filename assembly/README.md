cd ../
docker build -t quacks

1. Run mongo
docker run --name mongodb --restart always -p 27017:27017 -d mongo

2. Run QuAck
docker run -it -d --net=host quack
or
docker run -it -d --net=host -v /etc/quack:/etc/quack quack
to override properties