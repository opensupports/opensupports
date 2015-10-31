<?php
$app->group('/user', function () use ($app) {

    $app->get('/get/(:by)/(:value)', function () use ($app) {
        echo "Returns the user with $by = $value as a json";
    });

    $app->post('/login', function () use ($app) {
        // $app->response()->setStatus(400);
        $app->response()->setBody('{ "response": true }');
    });

    $app->post('/add', function () use ($app) {
        echo "You have the new";
    });
});
