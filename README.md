

## Requirements
* PHP 5.6+
* MySQL 4.1+

## Development
Here is a guide of how to set up the development environment in OpenSupports.

### Getting up and running FRONT-END (client folder)
1. Update: `sudo apt-get update`
2. Clone this repo: `git clone https://github.com/opensupports/opensupports.git`
3. Install node 4.x version:
    - `sudo apt-get install curl`
    - `curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -`
    - `sudo apt-get install -y nodejs`
4. Install npm: `sudo apt-get install npm`
5. Go to client: `cd opensupports/client`
6. Install dependencies: `npm install`
7. Rebuild node-sass: `npm rebuild node-sass`
8. Run: `npm start` (PHP server api it must be running at :8080)
10. Go to the main app: `http://localhost:3000/app` or to the component demo `http://localhost:3000/demo`
11. Your browser will automatically be opened and directed to the browser-sync proxy address.

Use the following line for running ONLY the frontend. No Backend needed.

12. Use `npm run-script start-fixtures` to enable fixtures and not require php server to be running.


OpenSupport uses by default the port 3000, but this port could already be used. If this is the case, you can modify this in the file: `client/webpack.config.js`.

##### Production Task

Just as there is a task for development, there is also a `npm build` task for putting the project into a production-ready state. This will run each of the tasks, while also adding the image minification task discussed above and the result store in `dist/` folder.

**Reminder:** Notice there is `index.html` and `index.php`. The first one searches the backend server where `config.js` says it, the second one uses `/api` to find the server. If you want to run OpenSupports in a single server, then use `index.php`.

#### Frontend Unit Testing
1. Do the steps described before.
2. Install mocha: `npm install -g mocha@6.2.0`
3. Run `npm test` to run the tests.

### Getting up and running BACK-END (server folder)
1. Install [Docker CE](https://docs.docker.com/install/)
2. Go to the server folder: `cd opensupports/server`
3. Run `make build` to build the images
4. Run `make install` to install composer dependencies

- `make run` runs the backend and database
- `make stop` stop backend and database server
- `make log` show live server logs
- `make db` access to mysql database console
- `make sh` access to backend docker container bash
- `make test` run phpunit tests
- `make doc` to build the documentation (requires `apidoc`)

Server api runs on `http://localhost:8080/`
Also, there's a *phpmyadmin* instance running on `http://localhost:6060/`,
you can access with the username `root` and empty password

##### Building
Once you've installed dependencies for frontend and backend, you can run `./build.sh` and it will generate a zip file inside `dist/` ready for distribution. You can use this file to install OpenSupports on a serving following the [installation instructions](https://github.com/opensupports/opensupports/wiki/Installation)

