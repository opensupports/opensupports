VERSIONING
===

1. In saas repository, we have a branch for each major release. Each branch matches a heroku server for that one.
2. When a new version is released, we create a new heroku dyno and deploy the branch there.
3. Also, deploy frontend files `opensupports_v4.4.js` and `opensupports_v4.4.css` for example. There's one for each version.
4. Each version has a url mapping in `opensupports-frontend` with points to the api.
5. To update a client
    1. Database backup
    2. Maintenance mode
    3. Make a request to `opensupports-migration` with clientId
    4. Update version number in redis
