<?php
use RedBeanPHP\Facade as RedBean;
/**
 * @api {OBJECT} Log Log
 * @apiVersion 4.6.1
 * @apiGroup Data Structures
 * @apiParam {String} type The type of the log.
 * @apiParam {String} to Object where the action was performed.
 * @apiParam {Object} author Author of the log.
 * @apiParam {String} author.name Name of the author.
 * @apiParam {Number} author.id Id of the author.
 * @apiParam {Boolean} author.staff Indicates if the author is a staff.
 * @apiParam {String} date Date of the log creation.
 */

class Log extends DataStore {
    const TABLE = 'log';

    public static function getProps() {
        return [
            'type',
            'authorUser',
            'authorStaff',
            'to',
            'date',
            'authorName'
        ];
    }

    public static function createLog($type, $to, $author = null) {
        $session = Session::getInstance();
        $authorName = '';

        if($session->isTicketSession()) {
            $ticketNumber = $session->getTicketNumber();
            $ticket = Ticket::getByTicketNumber($ticketNumber);
            $authorName = $ticket->authorToArray()['name'];
        }

        if($author === null) {
            $author = Controller::getLoggedUser();
        }

        if(!$author->isNull()) {
            $authorName = $author->name;
        }

        $log = new Log();

        $log->setProperties(array(
            'type' => $type,
            'to' => $to,
            'date' => Date::getCurrentDate(),
            'authorName' => $authorName
        ));

        if($author instanceof User) {
            $log->authorUser = $author;
        } else {
            $log->authorStaff = $author;
        }

        $log->store();
    }

    public function toArray() {
        $author = ($this->authorUser instanceof User) ? $this->authorUser : $this->authorStaff;

        return [
            'type' => $this->type,
            'to' => $this->to,
            'author' => [
                'name' => $this->authorName,
                'id' => ($author && !$author->isNull()) ? $author->id : null,
                'staff' => $author instanceof Staff
            ],
            'date' => $this->date
        ];
    }
}
