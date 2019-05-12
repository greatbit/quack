cd ../
docker build -t quacks

docker run -p 80:80 quack
or
docker run -it -d --net=host -v /etc/quack:/etc/quack quack