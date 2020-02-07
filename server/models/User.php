<?php
use RedBeanPHP\Facade as RedBean;

/**
 * @api {OBJECT} User User
 * @apiVersion 4.6.1
 * @apiGroup Data Structures
 * @apiParam {String} email The email of the user.
 * @apiParam {Number} id The id of the user.
 * @apiParam {String} name The name of the user.
 * @apiParam {Boolean} verified Indicates if the user has verified the email.
 * @apiParam {[CustomField](#api-Data_Structures-ObjectCustomfield)[]} customfields Indicates the values for custom fields.
 */

class User extends DataStore {
    const TABLE = 'user';

    public static function authenticate($userEmail, $userPassword) {
        $user = User::getUser($userEmail, 'email');

        return ($user && Hashing::verifyPassword($userPassword, $user->password)) ? $user : new NullDataStore();
    }

    public static function getProps() {
        return [
            'email',
            'password',
            'name',
            'signupDate',
            'tickets',
            'sharedTicketList',
            'verificationToken',
            'disabled',
            'xownCustomfieldvalueList'
        ];
    }

    public function getDefaultProps() {
        return [];
    }

    public static function getUser($value, $property = 'id') {
        return parent::getDataStore($value, $property);
    }

    public function canManageTicket(Ticket $ticket){
        return $ticket->isAuthor($this);
    }

    public function toArray() {
        return [
            'email' => $this->email,
            'id' => $this->id,
            'name' => $this->name,
            'verified' => !$this->verificationToken,
            'disabled' => $this->disabled,
            'customfields' => $this->xownCustomfieldvalueList->toArray(),
        ];
    }
}
