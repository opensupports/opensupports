<?php
use RedBeanPHP\Facade as RedBean;

class Ticket extends DataStore {
    const TABLE = 'ticket';

    private $author;

    public static function getProps() {
        return array(
            'ticketNumber',
            'title',
            'content',
            'language',
            'department',
            'file',
            'date',
            'unread',
            'closed',
            'author',
            'owner',
            'ownCommentList'
        );
    }

    public static function getTicket($value, $property = 'id') {
        return parent::getDataStore($value, $property);
    }

    public function getDefaultProps() {
        return array(
            'owner' => null,
            'ticketNumber' => $this->generateUniqueTicketNumber()
        );
    }

    public function store() {
        parent::store();

        if ($this->author instanceof User) {
            $this->author->store();
        }
    }
    public function generateUniqueTicketNumber() {
        $ticketQuantity = Ticket::count('ticket');
        $minValue = 100000;
        $maxValue = 999999;

        if ($ticketQuantity === 0) {
            $ticketNumber = Hashing::getRandomTicketNumber($minValue, $maxValue);
        } else {
            $firstTicketNumber = Ticket::getTicket(1)->ticketNumber;
            $gap = 176611;

            $ticketNumber = ($firstTicketNumber - $minValue + $ticketQuantity * $gap) % ($maxValue - $minValue + 1) + $minValue;
        }

        return $ticketNumber;
    }
}
