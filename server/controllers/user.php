<?php
$app->group('/user', function () use ($app) {

    $app->get('/new', function () use ($app) {
        echo "You have the new";
    });
});
