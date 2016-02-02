<?php
$app->group('/user', function () use ($app) {

    $app->get('/get/(:by)/(:value)', function () use ($app) {
        echo "Returns the user with $by = $value as a json";
    });

    $app->post('/create', function () use ($app) {
        $email =  Controller::request('email');
        $password =  Controller::request('password');

        $userInstance = new User();
        $userInstance->setProperties(array(
            'email' => $email,
            'password' => User::hashPassword($password),
            'admin' => 0
        ));
        $userId = $userInstance->store();

        Response::respondSuccess(array(
            'userId' => $userId,
            'userEmail' => $email
        ));
    });

    $app->post('/login', function () use ($app) {
        $session = Session::getInstance();

        $email =  Controller::request('email');
        $password =  Controller::request('password');

        if ($session->sessionExists()) {
            Response::respondError(ERRORS::SESSION_EXISTS);
        }

        $userInstance = User::authenticate($email, $password);

        if (!$userInstance) {
            Response::respondError(ERRORS::INVALID_CREDENTIALS);
        }

        $session->createSession($userInstance->id);

        Response::respondSuccess(array(
            'userId' => $userInstance->id,
            'userEmail' => $userInstance->email,
            'userIsAdmin' => $userInstance->admin,
            'token' => $session->getToken()
        ));
    });
});