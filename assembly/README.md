cd ../
docker build -t greatbit/quack .

1. Run mongo
docker run --name mongodb --restart always -p 27017:27017 -d mongo

2. Run QuAck
docker run -it -d --net=host greatbit/quack
or
docker run -it -d --net=host -v /etc/quack:/etc/quack greatbit/quack
to override properties