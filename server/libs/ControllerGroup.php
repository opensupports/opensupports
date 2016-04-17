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

        $app->group($this->groupPath, function () use ($app, $controllers) {
            foreach ($controllers as $controller) {
                $app->post($controller::PATH, $controller->getHandler());
            }
        });
    }
}
