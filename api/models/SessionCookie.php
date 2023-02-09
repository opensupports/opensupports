<?php
/**
 * @api {OBJECT} SessionCookie SessionCookie
 * @apiVersion 4.11.0
 * @apiGroup Data Structures
 * @apiParam {Boolean} isStaff Indicates if it wants to login a staff or a regular user.
 * @apiParam {Object} user The user.
 * @apiParam {Object} staff The staff.
 * @apiParam {String} token Token of the session, used to verify the session when making other requests.
 * @apiParam {String} ip The ip.
 * @apiParam {String} creationDate The creationDate.
 * @apiParam {String} expirationDate The expirationDate.
 */

class SessionCookie extends DataStore {
    const TABLE = 'sessioncookie';

    public static function getProps() {
        return array (
            'isStaff',
            'staff',
            'user',
            'token',
            'ip',
            'creationDate',
            'expirationDate'
        );
    }
}
