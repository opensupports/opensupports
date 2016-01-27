<?php
$app->group('/user', function () use ($app) {

    $app->get('/get/(:by)/(:value)', function () use ($app) {
        echo "Returns the user with $by = $value as a json";
    });

    //TODO: THIS METHOD CAN BE ONLY USED IF IT IS LOGIN AS ADMIN
    $app->get('/add/:email/:pass', function ($email, $pass) use ($app) {
        $userInstance = new User();
        $userInstance->setProperties(array(
            'email' => $email,
            'password' => $pass,
            'admin' => 0
        ));
        $id = $userInstance->store();
        Response::respondSuccess(array(
            'id' => $id
        ));
    });

    $app->post('/login', function () use ($app) {
        $email =  Controller::request('email');
        $password =  Controller::request('password');

        if ($userInstance = User::getUser($email, 'email')) {
            $pass = $userInstance->password;
        }
        else {
            Response::respondError(ERRORS::INVALID_CREDENTIALS);
        }

        if ($userInstance->password === $password) {
            Response::respondSuccess();
        }
        else {
            Response::respondError(ERRORS::INVALID_CREDENTIALS);
        }
    });
});