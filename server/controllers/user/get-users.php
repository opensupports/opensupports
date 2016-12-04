<?php
use Respect\Validation\Validator as DataValidator;

class GetUsersController extends Controller {
    const PATH = '/get-users';

    public function validations() {
        return[
            'permission' => 'staff_2',
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
        $userList = $this->getUserList();
        $userListArray = [];

        foreach ($userList as $user) {
            $userListArray[] = [
                'id' => $user->id,
                'name' => $user->name,
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