<?php
use Respect\Validation\Validator as DataValidator;
use RedBeanPHP\Facade as RedBean;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /ticket/search-authors search authors of tickets
 * @apiVersion 4.11.0
 *
 * @apiName Search authors
 *
 * @apiGroup Ticket
 *
 * @apiDescription This path returns all the authors that match with the query.
 *
 * @apiPermission staff1
 *
 * 
 * @apiParam {String} query A string to find into a ticket to make a custom search.
 * @apiParam {Object[]} blackList A array of objects {id, isStaff} with id and boolean to eliminate the authors of the new list.
 * @apiParam {Boolean} searchUsers A boolean that determinates if the search is for users or not
 * 
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_QUERY
 * 
 * @apiSuccess {Object} data Empty object
 *
 */

class SearchAuthorsController extends Controller {
    const PATH = '/search-authors';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_1',
            'requestData' => [
                'query' => [
                    'validation' => DataValidator::oneOf(DataValidator::stringType(),DataValidator::nullType()),
                    'error' => ERRORS::INVALID_QUERY
                ],
                'blackList' => [
                    'validation' => DataValidator::oneOf(DataValidator::validAuthorsBlackList(),DataValidator::nullType()),
                    'error' => ERRORS::INVALID_BLACK_LIST
                ],
                'searchUsers' => [
                    'validation' => DataValidator::oneOf(DataValidator::in(['0','1']),DataValidator::nullType()),
                    'error' => ERRORS::INVALID_USER_SEARCH_OPTION
                ]
            ]
        ];
    }

    public function handler() {
        $query = Controller::request('query');
        $searchUser = Controller::request('searchUsers') ? Controller::request('searchUsers') : 0;

        if(!$searchUser){
            $sqlQuery =  $this->generateAuthorsIdQuery($query);
        }else{
            $sqlQuery = $this->generateUsersIdQuery($query);
        }
        
        $dataStoresMatch = RedBean::getAll($sqlQuery, [':query' => "%" .$query . "%",':queryAtBeginning' => $query . "%"] );
        
        $list = [];
        foreach($dataStoresMatch as $dataStoreMatch) {
            if(!$searchUser && $dataStoreMatch['level'] >=1 && $dataStoreMatch['level'] <= 3){
                $dataStore = Staff::getDataStore($dataStoreMatch['id']*1);
            } else {
                $dataStore = User::getDataStore($dataStoreMatch['id']*1);
            }
            array_push($list, $dataStore->toArray(true));
        }
        Response::respondSuccess([
            'authors' => $list
        ]);
    }
    public function generateAuthorsIdQuery($query) {
        if ($query){      
            return "SELECT id,name, level FROM staff WHERE name LIKE :query " . $this->generateStaffBlackListQuery() . " UNION SELECT id,name,signup_date FROM user WHERE name LIKE :query " . $this->generateUserBlackListQuery() . " ORDER BY CASE WHEN (name LIKE :queryAtBeginning) THEN 1 ELSE 2 END ASC  LIMIT 10";
        } else {
            return "SELECT id,name, level FROM staff WHERE 1=1 ". $this->generateStaffBlackListQuery() . " UNION SELECT id,name,signup_date FROM user WHERE 1=1". $this->generateUserBlackListQuery() ." ORDER BY id LIMIT 10";
        } 
    }
    public function generateUsersIdQuery($query) {
        if ($query){      
            return "SELECT id FROM user WHERE name LIKE :query " . $this->generateUserBlackListQuery() . " ORDER BY CASE WHEN (name LIKE :queryAtBeginning) THEN 1 ELSE 2 END ASC LIMIT 10";
        } else {
            return "SELECT id FROM user WHERE 1=1 ". $this->generateUserBlackListQuery() ." ORDER BY id LIMIT 10";
        } 
    }

    public function generateStaffBlackListQuery(){
        $StaffBlackList = $this->getBlackListFiltered();
        return $this->generateBlackListQuery($StaffBlackList);
    }

    public function generateUserBlackListQuery(){
        $UserBlackList = $this->getBlackListFiltered(0);
        return $this->generateBlackListQuery($UserBlackList);
    }

    public function generateBlackListQuery($idList){    
        $text = "";
        foreach ($idList as $id) {
            $text .=  " AND id != " . $id;
        }
        return $text;
    }
    
    public function getBlackListFiltered($staff = 1){
        $blackList = json_decode(Controller::request('blackList'));
        $idList = [];
        if($blackList){
            foreach ($blackList as $item) {
                if($staff == $item->isStaff)  array_push($idList, $item->id);
            }
        }
            return $idList;
    }
}
