OpenSupports v4.0
============

### Getting up and running

1. [Create MySQL Database](#Create MySQL Database)
2. Clone this repo
3. Run `npm install` from the root directory
4. Create a mysql database
5. Run `gulp dev` (may require installing Gulp globally `npm install gulp -g`)
6. Your browser will automatically be opened and directed to the browser-sync proxy address
7. To prepare assets for production, run the `gulp prod` task (Note: the production task does not fire up the express server, and won't provide you with browser-sync's live reloading. Simply use `gulp dev` during development. More information below)

Now that `gulp dev` is running, the server is up as well and serving files from the `/build` directory. Any changes in the `/src` directory will be automatically processed by Gulp and the changes will be injected to any open browsers pointed at the proxy address.

### Create MySQL Database
1. Install mysql-server

    Ubuntu

     `sudo apt-get install mysql-server`
   
    Cent OS

    `sudo yum install mysql-server`
    `/etc/init.d/mysqld start`

2. Access the mysql shell 

     `mysql -u root -p`

3. Create a new user 

    `CREATE USER 'os_dev'@'localhost' IDENTIFIED BY 'os_dev';`

4. Create a new database

    `CREATE DATABASE os_dev;`

5. Assign privileges to user  

    `GRANT ALL ON os_dev.* TO 'os_dev'@'os_dev';`

##### Production Task

Just as there is the `gulp dev` task for development, there is also a `gulp prod` task for putting your project into a production-ready state. This will run each of the tasks, while also adding the image minification task discussed above. There is also an empty `gulp deploy` task that is included when running the production task. This deploy task can be fleshed out to automatically push your production-ready site to your hosting setup.

**Reminder:** When running the production task, gulp will not fire up the express server and serve your index.html. This task is designed to be run before the `deploy` step that may copy the files from `/build` to a production web server.