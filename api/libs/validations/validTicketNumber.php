<?php

namespace CustomValidations;

use Respect\Validation\Rules\AbstractRule;

class ValidTicketNumber extends AbstractRule {

    public function validate($ticketNumber) {
        $ticket = \Ticket::getByTicketNumber($ticketNumber);

        return !$ticket->isNull();
    }
}