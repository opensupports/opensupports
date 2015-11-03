<?php
$app->group('/user', function () use ($app) {

    $app->get('/get/(:by)/(:value)', function () use ($app) {
        echo "Returns the user with $by = $value as a json";
    });

    $app->get('/add/:user/:pass', function ($user, $pass) use ($app) {
        $userInstance = new User();
        $userInstance->setProperties(array(
            'user' => $user,
            'password' => $pass,
            'admin' => 0
        ));
        $id = $userInstance->store();
        Response::respondSuccess(array(
            'id' => $id
        ));
    });

    $app->post('/login', function () use ($app) {
        $user =  $app->request()->post('email');
        $password =  $app->request()->post('password');
        $pass = '';
        if ($userInstance = User::getUser($user, 'user')) {
            $pass = $userInstance->password;
        }

        if ($pass === $password) {
            Response::respondSuccess();
        }
        else {
            Response::respondError(ERRORS::UNDEFINED_CREDENTIALS);
        }
    });

    $app->post('/add', function () use ($app) {
        echo "You have the new";
    });
});
