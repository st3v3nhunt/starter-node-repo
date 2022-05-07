# starter-node-repo

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Known Vulnerabilities](https://snyk.io/test/github/st3v3nhunt/starter-node-repo/badge.svg)](https://snyk.io/test/github/st3v3nhunt/starter-node-repo)

> A blank, containerised repo with some useful modules installed to save time
> when starting a new project

## Usage

Create a new repository from this template and run `./rename.js` specifying the
new name of the repository and the description to use e.g.

```shell
./rename.js my-new-repo "Really useful description"
```

Once the rename has been completed the script can be removed.

If there is an issue during the rename the changes can be reverted via
`git clean -df && git checkout -- .`

## Running the application

The application is containerised for Docker and can be run via `docker` or
`docker-compose` commands. The easiest option is to use the convenience script
([scripts/start](./scripts/start)) which includes the commands to start the
application via `docker-compose`.

The commands to run the application with just docker are:

```shell
docker build . --build-arg NODE_ENV=development -t beer-quest

docker run --init -p 3000:3000 -p 9229:9229 -t beer-quest
```
