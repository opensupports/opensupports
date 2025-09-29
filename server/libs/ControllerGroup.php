<?php
class ControllerGroup {
    private $groupPath;
    private $controllers = array();

    public function setGroupPath($groupPath) {
        $this->groupPath = $groupPath;
    }

    public function addController($controller) {
        array_push($this->controllers, $controller);
    }

    public function finalize() {
        $app = Controller::getAppInstance();
        $controllers = $this->controllers;
        $groupPath = $this->groupPath;

        $app->group($groupPath, function () use ($controllers, $app) {
            foreach ($controllers as $controller) {
                // CORS preflight OPTIONS 요청 처리 (Slim 2.x 방식)
                $app->options($controller::PATH, function() {
                    header('Access-Control-Allow-Origin: *');
                    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
                    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
                    http_response_code(200);
                });

                if($controller::METHOD === 'POST') {
                    $app->post($controller::PATH, $controller->getHandler());
                } else {
                    $app->get($controller::PATH, $controller->getHandler());
                }
            }
        });
    }
}
