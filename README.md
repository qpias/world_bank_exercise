# TypeScript World Bank Example Microservice ![microlib](https://user-images.githubusercontent.com/6388707/58275504-7818c880-7d95-11e9-84af-f8aa50b93d5f.png)

[![styled with prettier](https://img.shields.io/badge/styled%20with-Prettier-blue.svg)](https://github.com/prettier/prettier)
[![tslint](https://img.shields.io/badge/linted%20by-TSLint-brightgreen.svg)](https://palantir.github.io/tslint/)
[![tested with node](https://img.shields.io/badge/tested%20with-node--tap-yellow.svg)](https://github.com/tapjs/node-tap)

Simple API and a quick, hacky, crappy UI to explore some World Bank data. I would not normally put the API and UI in the same microservice but I did not want to start a new project for the UI since it is just to showcase the API.

Install and start the dev server as described below and see the UI at http://localhost:8000/ and the API at http://localhost:8000/api/?countries=BR;CN;FI. You can play around with the country params but some countries are missing required data and will not work. Error handling is included. And some tests too to test that.

Based on https://github.com/nucleode/typescript-microservice-starter boilerplate with some added configs for the React UI. Most of the below content is from the readme for this boilerplate project.

## API files description

* src/bank.ts accessor for the World Bank api
* src/controller.ts controller class for the "business logic"
* src/index.ts mainly just the Express server
* src/types.ts various TypeScript type definition to make coding more fun
* src/utils.ts methods to calculate required values and country code handling

## UI files description

* static/index.html just html with the app js included.
* app/app.tsx just renders the UI components
* app/barcharts.tsx React component to create D3 charts that seems to do everything itself (and not too nicely)

## Test files description

* test/index.ts all the tests in the same file
* data.json example World Bank API json for testing the parsing and calculations.

## Features

* VS Code debugger configs in .vscode folder
* recommended Dockerfile for secure nodejs container
* tsconfig.json for [typescript compiler](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
* strict tslint.json for [tslint](https://palantir.github.io/tslint/)

## Getting Started

```
# Clone the repo
git clone https://github.com/qpias/world_bank_exercise.git {your_project_name}
cd {your_project_name}

# Remove reference to the original starter
rm -rf .git && npm init

# Initialize git repo with your own
git init

# Install development dependencies
npm i

# Add remote origin and make initial commit

git remote add origin git@github.com:{your_repository}.git
git add .
git commit -m "Initial commit"
git push -u origin master

# start development server
npm run dev
```

## Included npm scripts

Run this commands from the project folder with `npm run "script-name"`.
* `dev`: runs project in development mode, with [ts linter](https://palantir.github.io/tslint/) and `chokidar` watching `.ts` files inside `./src` folder and autorestart on save.
* `build`: builds all .ts files from `./src` folder to `./build`
* `lint`: lints source code using `tslint`
* `update`: easily check for updates and update all dependencies
* `test`: run tests using tap
* `test:watch`: run tests using tap in watch mode
* `test:report`: run tests using tap and adds report file
* `test:reporter`: run tests using tap and convert output to mocha

## External typings augmentation
This starter is already configured to allow you to extend typings of external packages. The logic behind it is based on [this](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-plugin-d-ts.html) official template. To augment a module, just create a folder with the same name as the module you are augmenting and add an index.d.ts in it. [Here](https://github.com/fox1t/fastify-websocket-router/tree/master/typings/fastify) you can find a real world example.

## Debugging
> Warning: This starter uses new V8 [inspect protocol](https://nodejs.org/api/debugger.html) so you have to use at least Node.js 7.7.4 if you want to use the included debugger settings.

#### Steps:
* start dev server with `npm run dev`
* now you have two ways:
  * use the provided debug URL in Chrome
  * use VS Code included (inside .vscode folder) `attach` config (best debugging experience)

## Docker Support

This stater uses Node.js best practices and creates dummy user to start node process, instead of using root user.

```
# Go to the root of your repo created from this starter
# Build your docker image
docker build -t my-project-name .

# run your docker container
docker run -p PORT:PORT my-project-name
```
