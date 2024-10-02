## Getting Started

### run in docker

1. First, install [node.js](https://nodejs.org/en) and npm (npm will automatically installed with node.js).

​	Add node and npm to path.

1. First, install [docker](https://docs.docker.com/get-docker/)
2. run docker container

```bash
cd src

# build src
./build.sh

#publish
./publish.sh

# build docker image
docker build -t moral-survey .

# run docker container
docker run -d -p 8080:80 moral-survey
```

### run in local

1. First, install [node.js](https://nodejs.org/en) and npm (npm will automatically installed with node.js).

​	Add node and npm to path.

2. Build the project

```bash
cd src

./build.sh
```

3. Enter the directory of of a survey: `cd moral-survey-2`

​	Run the following command run.

```ba
npm run devserver
```
