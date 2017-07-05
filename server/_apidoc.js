
/**
 * @api {post} /staff/get Get staff
 * @apiVersion 4.0.0
 *
 * @apiName Get staff
 *
 * @apiGroup Staff
 *
 * @apiDescription This path retrieves information about a staff member.
 *
 * @apiPermission staff1
 *
 * @apiParam {Number} staffId The id of the staff member to be searched.
 *
 * @apiUse NO_PERMISSION
 *
 * @apiSuccess {Object} data Information about a staff member
 * @apiSuccess {String} data.name Staff id
 * @apiSuccess {String} data.email Staff id
 * @apiSuccess {String} data.profilePic Staff id
 * @apiSuccess {Number} data.level Staff id
 * @apiSuccess {Boolean} data.staff Staff id
 * @apiSuccess {[Department](#api-Data_Structures-ObjectDepartment)[]} data.departments Array of departments that has assigned.
 * @apiSuccess {[Ticket](#api-Data_Structures-ObjectTicket)[]} data.tickets Array of tickets that has assigned.
 *
 */

/**
 * @api {get} /system/download Download file
 * @apiVersion 4.0.0
 *
 * @apiName Download file
 *
 * @apiGroup System
 *
 * @apiDescription This path downloads a file.
 *
 * @apiPermission any
 *
 * @apiParam {String} file The filename to be downloaded.
 *
 *
 * @apiSuccess {Object} file File content
 *
 */

/**
 * @api {post} /system/init-settings Init settings
 * @apiVersion 4.0.0
 *
 * @apiName Init settings
 *
 * @apiGroup System
 *
 * @apiDescription This path sets the initial settings. It can only be used once during installation.
 *
 * @apiPermission any
 *
 * @apiParam {String} language Indicates the default language of the system.
 * @apiParam {String} user-system-enabled Indicates if the user system should be enabled.
 * @apiParam {String} registration Indicates if the registration should be enabled.
 *
 * @apiUse INVALID_LANGUAGE
 * @apiUse INIT_SETTINGS_DONE
 *
 * @apiSuccess {Object} data Empty object
 *
 */

/**
 * @api {OBJECT} Staff Staff
 * @apiVersion 4.0.0
 * @apiGroup Data Structures
 * @apiParam {String} name Name of the staff member.
 * @apiParam {String} email Email of the staff member.
 * @apiParam {String} profilePic profilePic url of the staff member.
 * @apiParam {Number} level Level of the staff member.
 * @apiParam {Object[]} departments The departments the staff member has assigned.
 * @apiParam {[Ticket](#api-Data_Structures-ObjectTicket)[]} tickets The tickets the staff member has assigned.
 * @apiParam {Number} lastLogin The last login of the staff member.
 */