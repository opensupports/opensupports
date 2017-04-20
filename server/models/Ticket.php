<?php
/**
 * @api {OBJECT} Ticket Ticket
 * @apiGroup Data Structures
 * @apiParam {Number}  ticketNumber Users age.
 * @apiParam {String}  title Avatar-Image.
 * @apiParam {String}  content Avatar-Image.
 * @apiParam {Object}  department Avatar-Image.
 * @apiParam {Number}  department.id Avatar-Image.
 * @apiParam {String}  department.name Avatar-Image.
 * @apiParam {String}  file Avatar-Image.
 * @apiParam {String}  language Avatar-Image.
 * @apiParam {Boolean}  unread Avatar-Image.
 * @apiParam {Boolean}  unreadStaff Avatar-Image.
 * @apiParam {Boolean}  closed Avatar-Image.
 * @apiParam {String}  priority Avatar-Image.
 * @apiParam {Object}  author Avatar-Image.
 * @apiParam {Number}  author.id Avatar-Image.
 * @apiParam {String}  author.name Avatar-Image.
 * @apiParam {String}  author.email Avatar-Image.
 * @apiParam {Object}  owner Avatar-Image.
 * @apiParam {Number}  owner.id Avatar-Image.
 * @apiParam {String}  owner.name Avatar-Image.
 * @apiParam {String}  owner.email Avatar-Image.
 * @apiParam {[TicketEvent](#api-Data_Structures-ObjectTicketevent)[]} events Events related to the ticket.
 */
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
            'unreadStaff',
            'language',
            'authorEmail',
            'authorName'
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
        $linearCongruentialGenerator = new LinearCongruentialGenerator();
        $ticketQuantity = Ticket::count();

        if ($ticketQuantity === 0) {
            $ticketNumber = $linearCongruentialGenerator->generateFirst();
        } else {
            $linearCongruentialGenerator->setGap(Setting::getSetting('ticket-gap')->value);
            $linearCongruentialGenerator->setFirst(Ticket::getTicket(1)->ticketNumber);

            $ticketNumber = $linearCongruentialGenerator->generate($ticketQuantity);
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
            'unreadStaff' => !!$this->unreadStaff,
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
            return [
                'name' => $this->authorName,
                'email' => $this->authorEmail
            ];
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
            return null;
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
                    'profilePic' => ($author instanceof Staff) ? $author->profilePic : null,
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
