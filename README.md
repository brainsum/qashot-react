# QAShot React

## Usage

- cp ```config/config.php.example``` ```config/config.php```
- (Optional) create a ```.env``` file and add vars
    - See `docker-compose.yml` for the available ones
- ```./docker.startup.sh```    
- Visit ```localhost:8080```
    - Note, 8080 can be overwritten with a ```.env``` file

## Development
### React

See: [React default docs](docs/REACT.md)


### Docker builds
#### Update tags
In case of the src code changed:

- In `docker-compose.build.yml` update the following:
    - Under `x-build-args` the `SOURCE_CODE_IMAGE_TAG` arg
    - Under `services.build.image` the tag of the image
- In `docker-compose.yml`
    - update both image tags 


In case only some environment settings change:

- Update the tag of the updated image in `docker-compose.yml`
               
#### Build the images

Use the `docker.build.sh` script.

Note: If you want to build manually, you have to build the source code image first.

#### Push to docker hub

Use the `docker.publish.sh` script.
