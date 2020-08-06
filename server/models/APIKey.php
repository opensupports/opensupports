<?php
/**
 * @api {OBJECT} APIKey APIKey
 * @apiVersion 4.8.0
 * @apiGroup Data Structures
 * @apiParam {String} name Name of the APIKey.
 * @apiParam {String} token Token of the APIKey.
 */

class APIKey extends DataStore {
    const TABLE  = 'apikey';
    const TICKET_CREATE_PERMISSION = 'TICKET_CREATE_PERMISSION';
    const USER_CREATE_PERMISSION = 'USER_CREATE_PERMISSION';
    const TICKET_COMMENT_PERMISSION = 'TICKET_CREATE_PERMISSION';
    const TICKET_NUMBER_RETURN_PERMISSION = 'TICKET_NUMBER_RETURN_PERMISSION';

    const TYPES = [APIKey::TICKET_CREATE_PERMISSION,APIKey::USER_CREATE_PERMISSION,APIKey::TICKET_COMMENT_PERMISSION,APIKey::TICKET_NUMBER_RETURN_PERMISSION];

    public static function getProps() {
        return [
            'name',
            'token',
            'canCreateUsers',
            'canCreateTickets',
            'canCommentTickets',
            'shouldReturnTicketNumber'
        ];
    }
    
    public function toArray() {
        return [
            'name' => $this->name,
            'token' => $this->token,
            'canCreateUser' => $this->canCreateUsers,
            'canCreateTickets' => $this->canCreateTickets,
            'canCommentTickets' => $this->canCommentTickets,
            'shouldReturnTicketNumber' => $this->shouldReturnTicketNumber
        ];
    }
}