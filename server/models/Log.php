<?php
class Log {
    public static function getLog($id) {
        return RedBean::load('log', $id);
    }

    public static function log($properties) {
        $this->log = RedBean::dispense('LOGS');
        $log->date = RedBean::isoDateTime();
        $log->type = $properties['type'];
        $log->content = $properties['content'];
    }

    public function showUserDetails() {
        return $this->_user;
    }
}
