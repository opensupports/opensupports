<?php
/**
 * @api {OBJECT} Ticket Ticket
 * @apiGroup Data Structures
 * @apiParam {Number}  ticketNumber The number of the ticket.
 * @apiParam {String}  title The title of the ticket.
 * @apiParam {String}  content The content of the ticket.
 * @apiParam {Object}  department The department of the ticket.
 * @apiParam {Number}  department.id The id of the department of the ticket.
 * @apiParam {String}  department.name The department's name of the ticket.
 * @apiParam {String}  file The file of the ticket.
 * @apiParam {String}  language The language of the ticket.
 * @apiParam {Boolean}  unread The boolean to know if the user already readed or not.
 * @apiParam {Boolean}  unreadStaff The boolean to know if the staff already readed or not.
 * @apiParam {Boolean}  closed The boolean to know if the ticket is already closed or not.
 * @apiParam {String}  priority The priority of the ticket.
 * @apiParam {Object}  author The author of the ticket.
 * @apiParam {Number}  author.id The id of the author of the ticket.
 * @apiParam {String}  author.name The author's name of the ticket.
 * @apiParam {String}  author.email The author's email of the ticket.
 * @apiParam {Object}  owner The owner of the ticket.
 * @apiParam {Number}  owner.id The owner's id of the ticket.
 * @apiParam {String}  owner.name The owner's name of the ticket.
 * @apiParam {String}  owner.email The owner's email of the ticket.
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
