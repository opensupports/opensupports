<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /ticket/create-tag Create tag
 * @apiVersion 4.6.1
 *
 * @apiName Create tag
 *
 * @apiGroup Ticket
 *
 * @apiDescription This path creates a new tag.
 *
 * @apiPermission staff3
 *
 * @apiParam {Number} name The new name of the tag.
 * @apiParam {String} color The new color of the tag.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_NAME
 * @apiUse TAG_EXISTS
 *
 * @apiSuccess {Object} data Empty object
 *
 */

class CreateTagController extends Controller {
    const PATH = '/create-tag';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_3',
            'requestData' => [
                'name' => [
                    'validation' => DataValidator::notBlank()->length(2, 100),
                    'error' => ERRORS::INVALID_NAME
                ],
                'color' => [
                    'validation' => DataValidator::hexRgbColor()->startsWith('#'),
                    'error' => ERRORS::INVALID_COLOR
                ]
            ]
        ];
    }

    public function handler() {
        $name = Controller::request('name');
        $color = Controller::request('color');

        if (!Tag::getDataStore($name, 'name')->isNull()) {
            throw new RequestException(ERRORS::TAG_EXISTS);
        }

        $tagInstance = new Tag();

        $tagInstance->setProperties([
            'name' => $name,
            'color' => $color
        ]);
        $tagInstance->store();
        Response::respondSuccess();
    }
}
