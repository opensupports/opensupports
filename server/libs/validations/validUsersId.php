<?php

namespace CustomValidations;

use Respect\Validation\Rules\AbstractRule;

class ValidUsersId extends AbstractRule {

    public function validate($userIdList) {

        if(!is_array(json_decode($userIdList))) return false;

        foreach (json_decode($userIdList) as $userId) {
            $user = \User::getDataStore($userId);
            if($user->isNull()) return false;
        }
        return true;
    }
}