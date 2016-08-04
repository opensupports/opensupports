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
            'owner' => null
        );
    }
    
    public function store() {
        parent::store();
        
        if ($this->author instanceof User) {
            $this->author->store();
        }
    }
}