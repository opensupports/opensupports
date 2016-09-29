<?php

class Ticketevent extends DataStore {
    const TABLE = 'ticketevent';

    const COMMENT = 'COMMENT';
    const ASSIGN = 'ASSIGN';
    const UNASSIGN = 'UNASSIGN';
    const CLOSE = 'CLOSE';
    const REOPEN = 'REOPEN';
    const DEPARTMENT_CHANGED = 'DEPARTMENT_CHANGED';
    const PRIORITY_CHANGED = 'PRIORITY_CHANGED';

    private static function getEventTypes() {
        return [
            'COMMENT',
            'UNASSIGN',
            'CLOSE',
            'REOPEN',
            'DEPARTMENT_CHANGED',
            'PRIORITY_CHANGED',
        ];
    }

    public static function getEvent($type) {
        if (!in_array($type, Ticketevent::getEventTypes())) {
            return new NullDataStore();
        }

        $ticketEvent = new Ticketevent();
        $ticketEvent->setProperties([
            'type' => $type
        ]);

        return $ticketEvent;
    }

    public function getProps() {
        return [
            'type',
            'content',
            'file',
            'authorUser',
            'authorStaff',
            'date'
        ];
    }

    public function getAuthor() {
        if($this->authorUser) {
            return $this->authorUser;
        }

        if($this->authorStaff) {
            return $this->authorStaff;
        }

        return new NullDataStore();
    }
}