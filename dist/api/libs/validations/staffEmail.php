<?php

namespace CustomValidations;

use Respect\Validation\Rules\AbstractRule;

class StaffEmail extends AbstractRule {

    public function validate($email) {
        $user = \Staff::getUser($email, 'email');

        return !$user->isNull();
    }
}
