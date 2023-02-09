<?php
/**
 * @api {OBJECT} APIKey APIKey
 * @apiVersion 4.11.0
 * @apiGroup Data Structures
 * @apiParam {String} name Name of the APIKey.
 * @apiParam {String} token Token of the APIKey.
 */

class APIKey extends DataStore {
    const TABLE  = 'apikey';
    const TICKET_CREATE_PERMISSION = 'TICKET_CREATE_PERMISSION';
    const USER_CREATE_PERMISSION = 'USER_CREATE_PERMISSION';
    const TICKET_CHECK_PERMISSION = 'TICKET_CHECK_PERMISSION';
    const TICKET_NUMBER_RETURN_PERMISSION = 'TICKET_NUMBER_RETURN_PERMISSION';

    const TYPES = [APIKey::TICKET_CREATE_PERMISSION,APIKey::USER_CREATE_PERMISSION,APIKey::TICKET_CHECK_PERMISSION,APIKey::TICKET_NUMBER_RETURN_PERMISSION];

    public static function getProps() {
        return [
            'name',
            'token',
            'canCreateUsers',
            'canCreateTickets',
            'canCheckTickets',
            'shouldReturnTicketNumber'
        ];
    }
    
    public function toArray() {
        return [
            'name' => $this->name,
            'token' => $this->token,
            'canCreateUser' => $this->canCreateUsers,
            'canCreateTickets' => $this->canCreateTickets,
            'canCheckTickets' => $this->canCheckTickets,
            'shouldReturnTicketNumber' => $this->shouldReturnTicketNumber
        ];
    }
}