## Description

This project is based on [Nest.js](https://github.com/nestjs/nest) TypeScript starter repository.

---
## Installation

1) Install Node version specified in `.nvmrc` file

    The recommended way is to use [NVM](https://github.com/nvm-sh/nvm#installing-and-updating):

    ```bash
    $ nvm use
    ```
2. Install dependencies

    ```bash
    $ npm install
    ```

## Preparing the database
1. Install [PostgreSQL](https://www.postgresql.org/download/) for your system of choice and start the PostgreSQL server.

2. Create a new PostgreSQL user (e.g `postgres`) with a password of your choice.

3. Run the migration script
    ```bash
    $ psql -U {username from №2, e.g postgres} -h localhost -a -f src/database/migration.sql
    ```

## Preparing the ENV
Create a new `.env.local` file or fill in the missing parameters in the sample `.env` file.

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## API Collection

If you are using [Visual Studio Code](https://code.visualstudio.com/), you can enjoy the API Collection for the [Thunder Client](https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client) extension that is included in the repository.

To make use of it - install the extension and import the files from `/thunder-tests` directory.



