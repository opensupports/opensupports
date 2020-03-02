<?php
use Respect\Validation\Validator as DataValidator;
use RedBeanPHP\Facade as RedBean;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /ticket/get-authors Get authors of tickets
 * @apiVersion 4.6.1
 *
 * @apiName Get authors
 *
 * @apiGroup Ticket
 *
 * @apiDescription This path returns all the authors that match with the query.
 *
 * @apiPermission staff1
 *
 * 
 * @apiParam {String} query A string to find into a ticket to make a custom search.
 * @apiParam {Object[]} blackList A array of objects {id,staff} with id and boolean to eliminate the authors of the new list.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_QUERY
 * 
 * @apiSuccess {Object} data Empty object
 *
 */

class GetAuthorsController extends Controller {
    const PATH = '/get-authors';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_1',
            'requestData' => [
                'query' => [
                    'validation' => DataValidator::oneOf(DataValidator::notBlank(),DataValidator::nullType()),
                    'error' => ERRORS::INVALID_QUERY
                ],
                'blackList' => [
                    'validation' => DataValidator::oneOf(DataValidator::notBlank(),DataValidator::nullType(),DataValidator::arrayType()),
                    'error' => ERRORS::INVALID_BLACK_LIST
                ]
            ]
        ];
    }

    public function handler() {
        $query = Controller::request('query');

        $idAuthorsQuery =  "SELECT id,name,level FROM staff " . $this->GenerateAuthorsIdQuery($query) . " LIMIT 10";
        $authorsIdList = RedBean::getAll($idAuthorsQuery, [':query' => "%" .$query . "%",':query2' => $query . "%"] );
        $authorsList = [];
        
        foreach($authorsIdList as $item) {
            if($item['level'] >=1 && $item['level'] <= 3){
                $author = Staff::getDataStore($item['id']*1);
            } else {
                $author = User::getDataStore($item['id']*1);
            }
            array_push($authorsList, $author->toArray());
        }
        Response::respondSuccess([
            'authors' => $authorsList
        ]);
    }
    public function generateAuthorsIdQuery($query) {
        if ($query){      
            return "WHERE name LIKE :query " . $this->generateStaffBlackListQuery() . " UNION SELECT id,name,signup_date FROM user WHERE name LIKE :query " . $this->generateUserBlackListQuery() . " ORDER BY CASE WHEN (name LIKE :query2) THEN 1 ELSE 2 END ASC ";
        } else {
            return "WHERE 1=1 ". $this->generateStaffBlackListQuery() . " UNION SELECT id,name,signup_date FROM user WHERE 1=1". $this->generateUserBlackListQuery() ." ORDER BY id";
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
                if($staff == $item->staff)  array_push($idList, $item->id);
            }
        }
            return $idList;
    }
}
