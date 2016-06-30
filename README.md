OpenSupports v4.0

[![Build Status](https://codeship.com/projects/3faec3f0-908d-0133-1dce-661fcf0def08/status?branch=master)](https://codeship.com/projects/124436/)
============

### Getting up and running FRONT-END (client folder)
0. update `sudo apt-get update`
1. Clone this repo
2. Install node 4.x version
    - `sudo apt-get install curl`
    - `curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -`
    - `sudo apt-get install -y nodejs`
3. Install npm `sudo apt-get install npm`
4. Install gulp `sudo npm install -g gulp`
5. Go to repo `cd os4-react`
6. Install dependences `npm install`
7. Rebuild node-sass `npm rebuild node-sass`
8. Run `gulp dev`
9. Go to the main app: `http://localhost:3000/app` or the component demo `http://localhost:3000/demo`
10. Your browser will automatically be opened and directed to the browser-sync proxy address
12. Use `gulp dev --api` to disable fixtures and use the real php server api (it must be running at :8080).

Now that `gulp dev` is running, the server is up as well and serving files from the `/build` directory. Any changes in the `/src` directory will be automatically processed by Gulp and the changes will be injected to any open browsers pointed at the proxy address.


##### Production Task

Just as there is the `gulp dev` task for development, there is also a `gulp prod` task for putting your project into a production-ready state. This will run each of the tasks, while also adding the image minification task discussed above. There is also an empty `gulp deploy` task that is included when running the production task. This deploy task can be fleshed out to automatically push your production-ready site to your hosting setup.

**Reminder:** When running the production task, gulp will not fire up the express server and serve your index.html. This task is designed to be run before the `deploy` step that may copy the files from `/build` to a production web server.


#### Frontend Unit Testing
1. Do the steps described before
2. Install mocha "sudo npm install -g mocha"
3. Run `npm test` to run the tests

### Getting up and running BACK-END (server folder)

1. Clone this repo
2. [Install PHP 5.6](https://www.dev-metal.com/install-setup-php-5-6-ubuntu-14-04-lts/)
3. [Create MySQL Database](#markdown-header-create-mysql-database)
4. [Install composer](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-composer-on-ubuntu-14-04)
5. Go to `cd os4-react/api`
6. Run `composer install`
7. Run the server with `php -S localhost:8080`

##### Create MySQL Database

1. Install mysql-server

    Ubuntu

     `sudo apt-get install mysql-server`

    Cent OS

    `sudo yum install mysql-server`
    `/etc/init.d/mysqld start`

2. Access the mysql shell

     `mysql -u root`

3. Create a new database

    `CREATE DATABASE development;`

4. Run the MySQL server

    `sudo /etc/init.d/mysql start`
    
##### BACKEND API RUBY TESTING

1. Install ruby `sudo apt-get install ruby-full`
2. Install mysql dev dependencies `sudo apt-get install libmysqlclient-dev libmysqlclient16 ruby-dev`
3. Install bundle `sudo gem install bundler`
4. Go to test folder `cd os4-react/tests`
5. Install project dependencies `sudo gem install bundler`
Test can run by using executing `run-tests.sh` file.