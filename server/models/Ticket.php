<?php
use RedBeanPHP\Facade as RedBean;

class Ticket extends DataStore {
    const TABLE = 'ticket';

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
            'priority',
            'author',
            'owner',
            'ownTicketeventList',
            'unreadStaff'
        );
    }

    public static function getTicket($value, $property = 'id') {
        return parent::getDataStore($value, $property);
    }
    
    public static function getByTicketNumber($value) {
        return Ticket::getTicket($value, 'ticketNumber');
    }

    public function getDefaultProps() {
        return array(
            'priority' => 'low',
            'unread' => false,
            'unreadStaff' => true,
            'ticketNumber' => $this->generateUniqueTicketNumber()
        );
    }

    public function store() {
        parent::store();
    }

    public function generateUniqueTicketNumber() {
        $ticketQuantity = Ticket::count();
        $minValue = 100000;
        $maxValue = 999999;

        if ($ticketQuantity === 0) {
            $ticketNumber = Hashing::getRandomTicketNumber($minValue, $maxValue);
        } else {
            $firstTicketNumber = Ticket::getTicket(1)->ticketNumber;
            $gap = 176611; //TODO: USE RANDOM PRIME INSTEAD

            $ticketNumber = ($firstTicketNumber - $minValue + $ticketQuantity * $gap) % ($maxValue - $minValue + 1) + $minValue;
        }

        return $ticketNumber;
    }
    
    public function toArray() {
        return [
            'ticketNumber' => $this->ticketNumber,
            'title' => $this->title,
            'content' => $this->content,
            'department' => [
                'id' => $this->department->id,
                'name' => $this->department->name
            ],
            'date' => $this->date,
            'file' => $this->file,
            'language' => $this->language,
            'unread' => !!$this->unread,
            'closed' => !!$this->closed,
            'priority' => $this->priority,
            'author' => $this->authorToArray(),
            'owner' => $this->ownerToArray(),
            'events' => $this->eventsToArray()
        ];
    }

    public function authorToArray() {
        $author = $this->author;

        if ($author && !$author->isNull()) {
            return [
                'id' => $author->id,
                'name' => $author->name,
                'email' => $author->email
            ];
        } else {
            return [];
        }
    }

    public function ownerToArray() {
        $owner = $this->owner;

        if ($owner && !$owner->isNull()) {
            return [
                'id' => $owner->id,
                'name' => $owner->name,
                'email' => $owner->email
            ];
        } else {
            return [];
        }
    }

    public function eventsToArray() {
        $events = [];

        foreach ($this->ownTicketeventList as $ticketEvent) {
            $event = [
                'type' => $ticketEvent->type,
                'content'=> $ticketEvent->content,
                'author' => [],
                'date'=> $ticketEvent->date,
                'file'=> $ticketEvent->file
            ];

            $author = $ticketEvent->getAuthor();
            if(!$author->isNull()) {
                $event['author'] = [
                    'id'=> $author->id,
                    'name' => $author->name,
                    'email' =>$author->email,
                    'staff' => $author instanceof Staff
                ];
            }

            $events[] = $event;
        }

        return $events;
    }
    
    public function addEvent(Ticketevent $event) {
        $this->ownTicketeventList->add($event);
    }
}
