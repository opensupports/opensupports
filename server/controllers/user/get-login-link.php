<?php
use Respect\Validation\Validator as DataValidator;

/**
 * @api {post} /user/get-login-link Get login link
 * @apiVersion 4.11.0
 *
 * @apiName Get login link
 *
 * @apiGroup User
 *
 * @apiDescription Given a correct API key, this path generates a one-time link to automatically sign in as a certain user.
 *
 * @apiPermission staff1
 * 
 * TODO: correct this part of the 
 *
 * @apiParam {String} name The name of the user to log in.
 *
 * @apiUse INVALID_NAME
 *
 * @apiSuccess {Object} data Information about created user
 * @apiSuccess {Number} data.userId Id of the new user
 * @apiSuccess {String} data.userEmail Email of the new user
 *
 */

class GetLoginLinkController extends Controller {
  const PATH = '/get-login-link';
    const METHOD = 'POST';

  public function validations() {
    return [
      'permission' => 'staff_1',
      'requestData' => [
      ]
    ];
  }

  public function handler() {
    Response::respondSuccess([
      'ok' => 'yes, ok'
    ]);
  }
}