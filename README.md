![OpenSupports](http://www.opensupports.com/logo.png)

[![Build Status](https://travis-ci.org/opensupports/opensupports.svg?branch=master)](https://travis-ci.org/opensupports/opensupports) v4.1.2

OpenSupports is an open source ticket system built primarily with PHP and ReactJS.
Please, visit our website for more information: [http://www.opensupports.com/](http://www.opensupports.com/)

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
5. Install gulp: `sudo npm install -g gulp`
6. Go to client: `cd opensupports/client`
7. Install dependencies: `npm install`
8. Rebuild node-sass: `npm rebuild node-sass`
9. Run: `gulp dev`
10. Go to the main app: `http://localhost:3000/app` or to the component demo `http://localhost:3000/demo`
11. Your browser will automatically be opened and directed to the browser-sync proxy address.
12. Use `gulp dev --api` to disable fixtures and use the real PHP server api (it must be running at :8080).

Now that `gulp dev` is running, the server is up as well and serving files from the `/build` directory. Any changes in the `/src` directory will be automatically processed by Gulp and the changes will be injected to any open browsers pointed at the proxy address.

OpenSupport uses by default the port 3000, but this port could already be used. If this is the case, you can modify this in the file: `client/gulp/config.js`.

##### Production Task

Just as there is a `gulp dev` task for development, there is also a `gulp prod` task for putting the project into a production-ready state. This will run each of the tasks, while also adding the image minification task discussed above.

**Reminder:** Notice there is `index.html` and `index.php`. The first one searches the backend server where `config.js` says it, the second one uses `/api` to find the server. If you want to run OpenSupports in a single server, then use `index.php`.

#### Frontend Unit Testing
1. Do the steps described before.
2. Install mocha: `sudo npm install -g mocha`
3. Run `npm test` to run the tests.

### Getting up and running BACK-END (server folder)

1. Clone this repo: `git clone https://github.com/opensupports/opensupports.git`
2. [Install PHP 5.6](https://www.dev-metal.com/install-setup-php-5-6-ubuntu-14-04-lts/)
3. [Create MySQL Database](#markdown-header-create-mysql-database)
4. [Install composer](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-composer-on-ubuntu-14-04)
5. Go to the server folder: `cd opensupports/server`
6. Run: `composer install`
7. Run the server with: `php -S localhost:8080`

##### Create MySQL Database

1. Install mysql-server:

    Ubuntu

     `sudo apt-get install mysql-server`

    Cent OS

    `sudo yum install mysql-server`
    `/etc/init.d/mysqld start`

2. Access the MySQL shell:

     `mysql -u root`

3. Create a new database:

    `CREATE DATABASE development;`

4. Run the MySQL server:

    `sudo /etc/init.d/mysql start`

##### BACKEND API RUBY TESTING

1. Install Ruby: `sudo apt-get install ruby-full`
2. Install MySQL dev dependencies: `sudo apt-get install libmysqlclient-dev libmysqlclient16 ruby-dev`
3. Install bundle: `sudo gem install bundler`
4. Go to tests folder: `cd opensupports/tests`
5. Install project dependencies: `sudo gem install bundler`
Tests can run by using executing the `run-tests.sh` file.

##### BACKEND FAKE SMTP SERVER
If you're doing development, you can use a FakeSMTP server to see the mails that are being sent.

1. Install Java if you don't have it yet:

     `sudo apt-get install default-jre`
     `sudo apt-get install default-jdk`

2. [Download FakeSMTP](https://nilhcem.github.io/FakeSMTP/download.html)

3. Extract the file from the zip and run it:

    `java -jar fakeSMTP-2.0.jar`

4. Set the port to 7070 and start the SMTP server.

5. Every time the application sends an email, it will be reflected there.
