<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /system/add-custom-field Add a custom field
 * @apiVersion 4.6.1
 *
 * @apiName Add Custom field
 *
 * @apiGroup System
 *
 * @apiDescription This path creates a Custom field.
 *
 * @apiPermission staff2
 *
 * @apiParam {Number} name Name of the custom field.
 * @apiParam {String} type One of 'text' and 'select'.
 * @apiParam {String} options JSON array of strings with the option names.
 * @apiParam {String} description Description of the custom field.

 * @apiUse NO_PERMISSION
 * @apiUse INVALID_NAME
 * @apiUse INVALID_CUSTOM_FIELD_TYPE
 * @apiUse INVALID_CUSTOM_FIELD_OPTIONS
 * @apiUse CUSTOM_FIELD_ALREADY_EXISTS
 *
 * @apiSuccess {Object} data Empty object
 *
 */

class AddCustomFieldController extends Controller {
    const PATH = '/add-custom-field';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_2',
            'requestData' => [
                'name' => [
                    'validation' => DataValidator::notBlank()->length(2, 100),
                    'error' => ERRORS::INVALID_NAME
                ],
                'description' => [
                    'validation' => DataValidator::notBlank()->length(2, 100),
                    'error' => ERRORS::INVALID_DESCRIPTION
                ],
                'type' => [
                    'validation' => DataValidator::oneOf(
                        DataValidator::equals('text'),
                        DataValidator::equals('select')
                    ),
                    'error' => ERRORS::INVALID_CUSTOM_FIELD_TYPE
                ],
                'options' => [
                    'validation' => DataValidator::oneOf(
                        DataValidator::json(),
                        DataValidator::nullType()
                    ),
                    'error' => ERRORS::INVALID_CUSTOM_FIELD_OPTIONS
                ]
            ]
        ];
    }

    public function handler() {
        $name = Controller::request('name');
        $type = Controller::request('type');
        $description = Controller::request('description');
        $options = Controller::request('options');

        if(!Customfield::getDataStore($name, 'name')->isNull())
            throw new Exception(ERRORS::CUSTOM_FIELD_ALREADY_EXISTS);

        $customField = new Customfield();
        $customField->setProperties([
            'name' => $name,
            'type' => $type,
            'description' => $description,
            'ownCustomfieldoptionList' => $this->getOptionList($options)
        ]);

        $customField->store();

        Response::respondSuccess();
    }

    public function getOptionList($optionNames) {
        $options = new DataStoreList();
        if(!$optionNames) return $options;

        $optionNames = json_decode($optionNames);

        foreach($optionNames as $optionName) {
            $option = new Customfieldoption();
            $option->setProperties([
                'name' => $optionName,
            ]);
            $options->add($option);
        }

        return $options;
    }
}
