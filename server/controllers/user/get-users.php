<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /user/get-users Get users list
 * @apiVersion 4.6.1
 *
 * @apiName Get users list
 *
 * @apiGroup User
 *
 * @apiDescription This path retrieves the list of users by page.
 *
 * @apiPermission staff1
 *
 * @apiParam {Number} page Number of pages of users.
 * @apiParam {String} orderBy Parameter to order the users by tickets or id.
 * @apiParam {Boolean} desc Parameter to order the users in an ascending or descending way.
 * @apiParam {String} search Text query to find users.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_PAGE
 * @apiUse INVALID_ORDER
 * @apiUse USER_SYSTEM_DISABLED
 *
 * @apiSuccess {Object} data
 * @apiSuccess {[User](#api-Data_Structures-ObjectUser)[]} data.users Array of users found
 * @apiSuccess {Number} data.pages Number of pages found
 * @apiSuccess {Number} data.page Number of the page
 * @apiSuccess {String} data.orderBy Indicates if it's ordered by id or quantity of tickets
 * @apiSuccess {Boolean} data.desc Indicates if it's ordered in decreasing order
 * @apiSuccess {String} data.search Query of the search
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
            throw new RequestException(ERRORS::USER_SYSTEM_DISABLED);
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
                'signupDate' => $user->signupDate,
                'disabled' => !!$user->disabled
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
