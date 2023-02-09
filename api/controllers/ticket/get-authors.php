<?php
use Respect\Validation\Validator as DataValidator;
use RedBeanPHP\Facade as RedBean;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /ticket/get-authors Get authors of tickets
 * @apiVersion 4.11.0
 *
 * @apiName Get authors
 *
 * @apiGroup Ticket
 *
 * @apiDescription This path returns all the authors that match with the ids of the list .
 *
 * @apiPermission staff1
 *
 * 
 * @apiParam {Object[]} authors A array of object {id, isStaff} with id and boolean to get users or staffs.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_LIST
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
                'authors' => [
                    'validation' => DataValidator::ValidAuthorsList(),
                    'error' => ERRORS::INVALID_LIST
                ]
            ]
        ];
    }
    public function handler() {
        $dataStores = [];
        $authors = json_decode(Controller::request('authors'));
        
        if($authors){
            foreach ($authors as $author) {
                $item  = [];
                if($author->isStaff){
                    $item = Staff::getUser($author->id)->toArray(true);
                }else{
                    $item = User::getUser($author->id)->toArray(true);
                }
                array_push($dataStores,$item);
            }
        }

        Response::respondSuccess($dataStores);
    }
}
