## Description

A monorepo for a todo-list application built with Next.js and Nest.js.

## Demo
[Link](http://ec2-16-162-178-0.ap-east-1.compute.amazonaws.com:3000)

## Documentation
[Server](https://github.com/vrazn/todo-list/tree/master/server#readme)

[Client](https://github.com/vrazn/todo-list/tree/master/client#readme)

## Installation
The easiest way to compose all parts of the the application together is to use [Docker](https://docs.docker.com/engine/install/).

```bash
$ cd *project folder*
$ docker compose up
```

or to build the images locally

```bash
$ cd *project folder*
$ docker compose -f docker-compose.local.yml up
```

This will set up and configure a PostgreSQL database, run the required migrations, build and start the application.

The web application will then be available on `localhost:3000` and the server on `localhost:3001`.

## Manual Installation

Please follow the guides described in the [Server](https://github.com/vrazn/todo-list/tree/master/server#readme) and [Client](https://github.com/vrazn/todo-list/tree/master/client#readme) sections.

Please ensure that you're running a PostgreSQL server, Server and the Client locally:

```bash
$ service postgresql start

# ./client <-- terminal 1
$ npm run dev

# ./server <-- terminal 2
$ npm start:dev
```