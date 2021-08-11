<?php
use RedBeanPHP\Facade as RedBean;

/**
 * @api {OBJECT} User User
 * @apiVersion 4.7.0
 * @apiGroup Data Structures
 * @apiParam {String} email The email of the user.
 * @apiParam {Number} id The id of the user.
 * @apiParam {String} name The name of the user.
 * @apiParam {Boolean} verified Indicates if the user has verified the email.
 * @apiParam {Boolean} notRegistered Indicates if the user had logged at least one time.
 * @apiParam {[CustomField](#api-Data_Structures-ObjectCustomfield)[]} customfields Indicates the values for custom fields.
 */

class User extends DataStore {
    const TABLE = 'user';
    public $ticketNumber = null;
    public static function authenticate($userEmail, $userPassword) {
        $user = User::getUser($userEmail, 'email');

        return ($user && Hashing::verifyPassword($userPassword, $user->password) && !$user->notRegistered) ? $user : new NullDataStore();
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
            'xownCustomfieldvalueList',
            'notRegistered'
        ];
    }

    public function getDefaultProps() {
        return [];
    }

    public static function getUser($value, $property = 'id') {
        return parent::getDataStore($value, $property);
    }

    public function canManageTicket(Ticket $ticket){
        $ticketNumberInstanceValidation = true;

        if($this->ticketNumber) {
            $ticketNumberInstanceValidation = $this->ticketNumber == $ticket->ticketNumber;
        }

        return ($ticket->isAuthor($this) && $ticketNumberInstanceValidation);
    }

    public function toArray() {
        return [
            'email' => $this->email,
            'id' => $this->id,
            'name' => $this->name,
            'verified' => !$this->verificationToken,
            'disabled' => $this->disabled,
            'customfields' => $this->xownCustomfieldvalueList->toArray(),
            'notRegistered' => $this->notRegistered
        ];
    }
}
