# Post Me Daddy

A generic social communication platform built using `graphql`.

## How to run

### Easy way

The project includes `docker-compose.yml` & `Dockerfile` for project setup. The project is also using `.env` file. Here's how you set it up.

* install `docker` & `docker-compose` (step depends upon the distro you using, so checkout [docker doc](https://docs.docker.com/get-docker/))
* install `docker-buildx`. Check the info [here](https://docs.docker.com/build/install-buildx/). Included by default with `docker-desktop`.
* setup `buildx` as default build tool for docker
```sh
$ docker buildx install
```
* fill up the `.env` file with the values (I've included the required env keys in the file)
* copy the `.env` from root dir of project to `post_me_server` folder. (This step is needed because .env file is needed inside the container we're creating for backend of project)
```sh
$ cp .env post_me_server/.env
```
* Build the images with `docker-compose`
```sh
$ docker-compose build --no-cache
```
* Make the containers up
```sh
$ docker-compose up
```

### Hard way

Probably will update here, with different steps I did to make it run locally without docker (in case if it's needed)
