# QAShot

## Requirements
* Node.js>=6.0
* Yarn as a global NPM dependency

## Development
* install dependencies by running ```yarn```
* run ```yarn start dev```, this will start up a dev server and you can test the app on ```http://localhost:8080```

### Production build
* run ```yarn start webpack```
* bundle file will be in the build folder
* @todo: Enable uglification

## Docker
You can use the app with docker, too.

### Requirements
* docker
* docker-compose (high enough version to support v2 docker-compose.yml files)

### Usage
* ```docker-compose up -d```
  * This is going to start to build a docker image. It might take a while.
  * However, this is only going to happen once.
* ```docker-compose ps```
  * This command should say 'State: Up'
* ```docker-compose logs```
  * This should start with: Project is running at http://0.0.0.0:8080/
  * And end with: webpack: Compiled successfully.
* Access the site at ```localhost:8080```
* ```docker-compose down```
  * shut down the site with this when finished
  