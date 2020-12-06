# TypeScript World Bank Example Microservice ![microlib](https://user-images.githubusercontent.com/6388707/58275504-7818c880-7d95-11e9-84af-f8aa50b93d5f.png)

[![styled with prettier](https://img.shields.io/badge/styled%20with-Prettier-blue.svg)](https://github.com/prettier/prettier)
[![tslint](https://img.shields.io/badge/linted%20by-TSLint-brightgreen.svg)](https://palantir.github.io/tslint/)
[![tested with node](https://img.shields.io/badge/tested%20with-node--tap-yellow.svg)](https://github.com/tapjs/node-tap)

Simple GraphQL API and a quick, hacky UI to explore some World Bank data. I would not normally put the API and UI in the same project but I did not want to start a new project for the UI since it is just to showcase the API.

Install and start the dev servers as described below and see the UI at http://localhost:8000/ and the API at http://localhost:7000. You can play around with the country params but some countries are missing required data and will not work. Some error handling is included. And some tests too to test that.

Sample GraphQL call: `{ measures(countries:["BR", "FI"])	{country avgPopulation}	}`

The idea was to use Node and GraphQL but also add some static typing to avoid the usual runtime errors and debugging difficulties. The library https://typegraphql.com/ was selected as it provides a way to do this with TypeScript and not too much boilerplate code.

Based on https://github.com/nucleode/typescript-microservice-starter TypeScript example to have a working project to start with. I have added some libs and configs for the GraphQL stuff, React UI etc. Most of the below content is from the readme for this boilerplate project.

## API files description

* src/bank.ts accessor for the World Bank API
* src/resolver.ts a kind of controller class that contains some type-graphql magick
* src/index.ts starts an Apollo server for GraphQL and an Express server for the UI
* src/types.ts various TypeScript type definitions to make coding more fun
* src/utils.ts methods to calculate required values and country code handling

## UI files description

* static/index.html just html with the app js included.
* app/app.tsx just renders the UI components
* app/barcharts.tsx React component to create D3 charts that seems to do everything by itself

## Test files description

* test/index.ts all the tests in the same file
* test/data.json example World Bank API json for testing the parsing and calculations.

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
