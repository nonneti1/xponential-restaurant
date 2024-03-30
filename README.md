## Backend API Challenge Submission for Xponential

## Description

This application used NestJS framework as a server API and implemented based on given problems.

## Installation
<p>Supported yarn version 1.22.19 or higher</p>
First, Install node modules by

```bash
$ yarn
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev
```
## Running on Docker
```bash
# make sure docker is running 
# in terminal at project directory, run this command
$ ./build-and-run-local.sh
```
Or if you are on windows, You can also run ```build-and-run-local.bat``` as well.

Both method will be exposed at port 3000, If the port is not available it will show an error.

## API Description
```bash
# after the server is running, go to this url
http://localhost:3000/api
```

## Test

```bash
# this command will run every test cases in src/test/ 
$ yarn test
```
