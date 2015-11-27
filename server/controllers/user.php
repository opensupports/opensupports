<?php
$app->group('/user', function () use ($app) {

    $app->get('/get/(:by)/(:value)', function () use ($app) {
        echo "Returns the user with $by = $value as a json";
    });

    //TODO: THIS METHOD CAN BE ONLY USED IF IT IS LOGIN AS ADMIN
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

        if ($userInstance = User::getUser($user, 'user')) {
            $pass = $userInstance->password;
        }
        else {
            Response::respondError(ERRORS::INVALID_CREDENTIALS);
        }

        if ($pass === $password) {
            Response::respondSuccess();
        }
        else {
            Response::respondError(ERRORS::INVALID_CREDENTIALS);
        }
    });
});
