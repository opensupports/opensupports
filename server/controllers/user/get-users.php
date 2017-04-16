<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /user/get-users Give back the information of a list of users.
 *
 * @apiName get-users
 *
 * @apiGroup User
 *
 * @apiDescription This path give back information about a list of users.
 *
 * @apiPermission Staff level 1
 *
 * @apiParam {number} page number of pages of users.
 *
 * @apiParam {string} orderBy Parameter to order the users by tickets or id.
 *
 * @apiParam {bool} desc  Parameter to order the user ascending or descending way.
 *
 * @apiParam {string} search Key to find some specific users.
 *
 * @apiError {String} message
 *
 * @apiSuccess {Object} data
 *
 */

class GetUsersController extends Controller {
    const PATH = '/get-users';
    const METHOD = 'POST';

    public function validations() {
        return[
            'permission' => 'staff_1',
            'requestData' => [
                'page' => [
                    'validation' => DataValidator::numeric(),
                    'error' => ERRORS::INVALID_PAGE
                ],
                'orderBy' => [
                    'validation' => DataValidator::in(['id','tickets']),
                    'error' => ERRORS::INVALID_ORDER
                ]
            ]
        ];
    }

    public function handler() {
        if(!Controller::isUserSystemEnabled()) {
            throw new Exception(ERRORS::USER_SYSTEM_DISABLED);
        }
        
        $userList = $this->getUserList();
        $userListArray = [];

        foreach ($userList as $user) {
            $userListArray[] = [
                'id' => $user->id,
                'name' => $user->name,
                'verified' => !$user->verificationToken,
                'tickets' => $user->tickets,
                'email' => $user->email,
                'signupDate' => $user->signupDate
            ];
        }

        Response::respondSuccess([
            'users' => $userListArray,
            'pages' => $this->getPagesQuantity(),
            'page' => Controller::request('page'),
            'orderBy' => Controller::request('orderBy'),
            'desc' => Controller::request('desc'),
            'search' => Controller::request('search')
        ]);
    }

    private function getUserList() {
        $query = $this->getSearchQuery();

        return User::find($query, [
            '%' . Controller::request('search') . '%',
            '%' . Controller::request('search') . '%',
            Controller::request('search') . '%',
            Controller::request('search') . '%'
        ]);
    }

    private function getPagesQuantity() {
        $query = '';

        if(Controller::request('search')) {
            $query .= " (name LIKE ? OR email LIKE ? )";
        }

        $usersQuantity = User::count($query, [
            '%' . Controller::request('search') . '%',
            '%' . Controller::request('search') . '%'
        ]);

        return ceil($usersQuantity / 10);
    }

    private function getSearchQuery() {
        $query = '';

        if(Controller::request('search')) {
            $query .= " (name LIKE ? OR email LIKE ? )";
            $query .= " ORDER BY CASE WHEN (name LIKE ? OR email LIKE ?)";
            $query .= " THEN 1 ELSE 2 END ASC,";
        } else {
            $query .= " ORDER BY ";
        }

        $query .= $this->getOrderAndLimit();

        return $query;
    }

    private function getOrderAndLimit() {
        $query = '';

        if(Controller::request('orderBy') === 'tickets') {
            $query .= 'tickets';
        } else {
            $query .= 'id';
        }

        if(Controller::request('desc')) {
            $query .= ' desc';
        } else {
            $query .= ' asc';
        }
        $query .= " LIMIT 10 OFFSET ". ((Controller::request('page')-1)*10);

        return $query;
    }
}