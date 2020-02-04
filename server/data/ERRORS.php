<?php
/**
 * @apiDefine INVALID_CREDENTIALS
 * @apiError {String} INVALID_CREDENTIALS Login credentials does not match.
 */
/**
 * @apiDefine SESSION_EXISTS
 * @apiError {String} SESSION_EXISTS The session already exists.
 */
/**
 * @apiDefine USER_EXISTS
 * @apiError {String} USER_EXISTS The user already exists.
 */
 /**
  * @apiDefine TAG_EXISTS
  * @apiError {String} TAG_EXISTS The tag already exists.
  */
 /**
 * @apiDefine NO_PERMISSION
 * @apiError {String} NO_PERMISSION You have no permission to perform this operation.
 */
/**
 * @apiDefine INVALID_TITLE
 * @apiError {String} INVALID_TITLE The title is invalid, probably too short.
 */
/**
 * @apiDefine INVALID_CONTENT
 * @apiError {String} INVALID_CONTENT The content is invalid, probably to short.
 */
/**
 * @apiDefine INVALID_EMAIL
 * @apiError {String} INVALID_EMAIL The email is invalid or already exists.
 */
/**
 * @apiDefine INVALID_PASSWORD
 * @apiError {String} INVALID_PASSWORD The password is invalid, probably too short.
 */
/**
 * @apiDefine INVALID_NAME
 * @apiError {String} INVALID_NAME The name is invalid, probably too short.
 */
/**
 * @apiDefine INVALID_DESCRIPTION
 * @apiError {String} INVALID_DESCRIPTION The description is invalid.
 */
/**
 * @apiDefine INVALID_SETTING
 * @apiError {String} INVALID_SETTING The setting are invalid.
 */
/**
 * @apiDefine INVALID_DEPARTMENT
 * @apiError {String} INVALID_DEPARTMENT The dapartment is invalid, probably too short.
 */
/**
 * @apiDefine INVALID_TICKET
 * @apiError {String} INVALID_TICKET The ticket is invalid.
 */
 /**
  * @apiDefine INVALID_TAG
  * @apiError {String} INVALID_TAG The tag is invalid.
  */
 /**
 * @apiDefine INIT_SETTINGS_DONE
 * @apiError {String} INIT_SETTINGS_DONE The init settings are already done.
 */
/**
 * @apiDefine INVALID_OLD_PASSWORD
 * @apiError {String} INVALID_OLD_PASSWORD The old password is invalid.
 */
/**
 * @apiDefine INVALID_CAPTCHA
 * @apiError {String} INVALID_CAPTCHA The captcha is invalid.
 */
/**
 * @apiDefine INVALID_TICKET_EVENT
 * @apiError {String} INVALID_TICKET_EVENT The ticket event is invalid.
 */
/**
 * @apiDefine INVALID_LANGUAGE
 * @apiError {String} INVALID_LANGUAGE The language is invalid.
 */
/**
 * @apiDefine TICKET_ALREADY_ASSIGNED
 * @apiError {String} TICKET_ALREADY_ASSIGNED The ticket is already assigned.
 */
/**
 * @apiDefine INVALID_PRIORITY
 * @apiError {String} INVALID_PRIORITY The priority is invalid.
 */
/**
 * @apiDefine INVALID_PAGE
 * @apiError {String} INVALID_PAGE The page is invalid.
 */
/**
 * @apiDefine INVALID_QUERY
 * @apiError {String} INVALID_QUERY The query is invalid.
 */
/**
 * @apiDefine INVALID_TAG_FILTER
 * @apiError {String} INVALID_TAG_FILTER The tag filter is invalid.
 */
/**
 * @apiDefine INVALID_CLOSED_FILTER
 * @apiError {String} INVALID_CLOSED_FILTER The closed filter is invalid.
 */
/**
 * @apiDefine INVALID_UNREAD_STAFF_FILTER
 * @apiError {String} INVALID_UNREAD_STAFF_FILTER The unread-staff filter is invalid.
 */
/**
 * @apiDefine INVALID_PRIORITY_FILTER
 * @apiError {String} INVALID_PRIORITY_FILTER The priority filter is invalid.
 */
/**
 * @apiDefine INVALID_DATE_RANGE_FILTER
 * @apiError {String} INVALID_DATE_RANGE_FILTER The date-range filter is invalid.
 */
/**
 * @apiDefine INVALID_DEPARTMENT_FILTER
 * @apiError {String} INVALID_DEPARTMENT_FILTER The department filter is invalid.
 */
/**
 * @apiDefine INVALID_AUTHOR_FILTER
 * @apiError {String} INVALID_AUTHOR_FILTER The author filter is invalid.
 */
/**
 * @apiDefine INVALID_OWNER_FILTER
 * @apiError {String} INVALID_OWNER_FILTER The owner filter is invalid.
 */
/**
 * @apiDefine INVALID_ASSIGNED_FILTER
 * @apiError {String} INVALID_ASSIGNED_FILTER The assigned filter is invalid.
 */
/**
 * @apiDefine INVALID_QUERY_FILTER
 * @apiError {String} INVALID_QUERY_FILTER The query filter is invalid.
 */
/**
 * @apiDefine INVALID_ORDER_BY
 * @apiError {String} INVALID_ORDER_BY The order-by is invalid.
 */
/**
 * @apiDefine INVALID_TOPIC
 * @apiError {String} INVALID_TOPIC The topic is invalid.
 */
/**
 * @apiDefine INVALID_SEARCH
 * @apiError {String} INVALID_SEARCH The search is invalid.
 */
/**
 * @apiDefine INVALID_ORDER
 * @apiError {String} INVALID_ORDER The order is invalid.
 */
/**
 * @apiDefine INVALID_USER
 * @apiError {String} INVALID_USER The user is invalid.
 */
/**
 * @apiDefine ALREADY_BANNED
 * @apiError {String} ALREADY_BANNED It's already banned.
 */
/**
 * @apiDefine INVALID_LEVEL
 * @apiError {String} INVALID_LEVEL The level is invalid.
 */
/**
 * @apiDefine ALREADY_A_STAFF
 * @apiError {String} ALREADY_A_STAFF It's already a staff.
 */
/**
 * @apiDefine INVALID_STAFF
 * @apiError {String} INVALID_STAFF The staff is invalid.
 */
/**
 * @apiDefine SAME_DEPARTMENT
 * @apiError {String} SAME_DEPARTMENT It's the same department.
 */
/**
 * @apiDefine INVALID_TOKEN
 * @apiError {String} INVALID_TOKEN The token is invalid.
 */
/**
 * @apiDefine UNVERIFIED_USER
 * @apiError {String} UNVERIFIED_USER The user is not verified.
 */
/**
 * @apiDefine INVALID_TEMPLATE
 * @apiError {String} INVALID_TEMPLATE The template is invalid.
 */
/**
 * @apiDefine INVALID_SUBJECT
 * @apiError {String} INVALID_SUBJECT The subject is invalid.
 */
/**
 * @apiDefine INVALID_BODY
 * @apiError {String} INVALID_BODY The body is invalid.
 */
/**
 * @apiDefine USER_SYSTEM_ENABLED
 * @apiError {String} USER_SYSTEM_ENABLED The user system is enabled.
 */
/**
 * @apiDefine USER_SYSTEM_DISABLED
 * @apiError {String} USER_SYSTEM_DISABLED The user system is disabled.
 */
/**
 * @apiDefine SYSTEM_USER_IS_ALREADY_DISABLED
 * @apiError {String} SYSTEM_USER_IS_ALREADY_DISABLED The system user is already disabled.
 */
/**
 * @apiDefine SYSTEM_USER_IS_ALREADY_ENABLED
 * @apiError {String} SYSTEM_USER_IS_ALREADY_ENABLED The system user is already enabled.
 */
/**
 * @apiDefine INVALID_PERIOD
 * @apiError {String} INVALID_PERIOD The period is invalid.
 */
/**
 * @apiDefine NAME_ALREADY_USED
 * @apiError {String} NAME_ALREADY_USED The name is already used.
 */
/**
 * @apiDefine INVALID_FILE
 * @apiError {String} INVALID_FILE The file is invalid or max size exceeded.
 */
/**
 * @apiDefine DATABASE_CONNECTION
 * @apiError {String} DATABASE_CONNECTION It's a database connection error.
 */
/**
 * @apiDefine DATABASE_CREATION
 * @apiError {String} DATABASE_CREATION It's a database creation error.
 */
/**
 * @apiDefine SMTP_CONNECTION
 * @apiError {String} SMTP_CONNECTION Could not connect with SMTP server.
 */
/**
 * @apiDefine ALREADY_DISABLED
 * @apiError {String} ALREADY_DISABLED User is already disabled
 */
/**
 * @apiDefine ALREADY_ENABLED
 * @apiError {String} ALREADY_ENABLED User is already enabled
 */
/**
 * @apiDefine USER_DISABLED
 * @apiError {String} USER_DISABLED User is disabled
 */
/**
 * @apiDefine INVALID_TEXT_1
 * @apiError {String} INVALID_TEXT_1 text1 of mail template has an invalid syntax or missing variables
 */
/**
 * @apiDefine INVALID_TEXT_2
 * @apiError {String} INVALID_TEXT_2 text2 of mail template has an invalid syntax or missing variables
 */
/**
 * @apiDefine INVALID_TEXT_3
 * @apiError {String} INVALID_TEXT_3 text3 of mail template has an invalid syntax or missing variables
 */
/**
 * @apiDefine DEPARTMENT_PRIVATE_TICKETS
 * @apiError {String} DEPARTMENT_PRIVATE_TICKETS There are tickets for in department created by non-staff and it can't be private
 */
/**
 * @apiDefine EMAIL_POLLING
 * @apiError {String} EMAIL_POLLING Email polling was unsuccesful
 */
/**
 * @apiDefine IMAP_CONNECTION
 * @apiError {String} IMAP_CONNECTION Imap connection was unsuccesfull
 */
/**
* @apiDefine CUSTOM_FIELD_ALREADY_EXISTS
* @apiError {String} CUSTOM_FIELD_ALREADY_EXISTS Custom field already exists
*/
/**
* @apiDefine INVALID_CUSTOM_FIELD
* @apiError {String} INVALID_CUSTOM_FIELD Custom field id is invalid
*/
/**
* @apiDefine INVALID_CUSTOM_FIELD_TYPE
* @apiError {String} INVALID_CUSTOM_FIELD_TYPE The type is invalid
*/
/**
 * @apiDefine INVALID_CUSTOM_FIELD_OPTIONS
 * @apiError {String} INVALID_CUSTOM_FIELD_OPTIONS Options are not a json array
 */
/**
 * @apiDefine INVALID_CUSTOM_FIELD_OPTION
 * @apiError {String} INVALID_CUSTOM_FIELD_OPTION Option is not in the list of possibles
 */
/**
 * @apiDefine UNAVAILABLE_STATS
 * @apiError {String} UNAVAILABLE_STATS Stats are currently unavailable
 */
/**
 * @apiDefine INVALID_COLOR
 * @apiError {String} INVALID_COLOR The color should be in hexadecimal, preceded by a '#'
 */
/**
 * @apiDefine INVALID_API_KEY_TYPE
 * @apiError {String} INVALID_API_KEY_TYPE Api key type is not one of the availables
 */

class ERRORS {
    const INVALID_CREDENTIALS = 'INVALID_CREDENTIALS';
    const SESSION_EXISTS = 'SESSION_EXISTS';
    const USER_EXISTS = 'USER_EXISTS';
    const TAG_EXISTS = 'TAG_EXISTS';
    const NO_PERMISSION = 'NO_PERMISSION';
    const INVALID_TITLE = 'INVALID_TITLE';
    const INVALID_CONTENT = 'INVALID_CONTENT';
    const INVALID_EMAIL = 'INVALID_EMAIL';
    const INVALID_PASSWORD = 'INVALID_PASSWORD';
    const INVALID_NAME = 'INVALID_NAME';
    const INVALID_DESCRIPTION = 'INVALID_DESCRIPTION';
    const INVALID_SETTING = 'INVALID_SETTING';
    const INVALID_DEPARTMENT = 'INVALID_DEPARTMENT';
    const INVALID_TICKET = 'INVALID_TICKET';
    const INVALID_TAG = 'INVALID_TAG';
    const INIT_SETTINGS_DONE = 'INIT_SETTINGS_DONE';
    const INVALID_OLD_PASSWORD = 'INVALID_OLD_PASSWORD';
    const INVALID_CAPTCHA = 'INVALID_CAPTCHA';
    const INVALID_TICKET_EVENT = 'INVALID_TICKET_EVENT';
    const INVALID_LANGUAGE = 'INVALID_LANGUAGE';
    const INVALID_SUPPORTED_LANGUAGES = 'INVALID_SUPPORTED_LANGUAGES';
    const TICKET_ALREADY_ASSIGNED = 'TICKET_ALREADY_ASSIGNED';
    const INVALID_PRIORITY = 'INVALID_PRIORITY';
    const INVALID_PAGE = 'INVALID_PAGE';
    const INVALID_QUERY = 'INVALID_QUERY';
    const INVALID_TAG_FILTER = 'INVALID_TAG_FILTER';
    const INVALID_CLOSED_FILTER = 'INVALID_CLOSED_FILTER';
    const INVALID_UNREAD_STAFF_FILTER = 'INVALID_UNREAD_STAFF_FILTER';
    const INVALID_PRIORITY_FILTER = 'INVALID_PRIORITY_FILTER';
    const INVALID_DATE_RANGE_FILTER = 'INVALID_DATE_RANGE_FILTER';
    const INVALID_DEPARTMENT_FILTER = 'INVALID_DEPARTMENT_FILTER';
    const INVALID_AUTHOR_FILTER = 'INVALID_AUTHOR_FILTER';
    const INVALID_OWNER_FILTER = 'INVALID_OWNER_FILTER';
    const INVALID_ASSIGNED_FILTER = 'INVALID_ASSIGNED_FILTER';
    const INVALID_QUERY_FILTER = 'INVALID_QUERY_FILTER';
    const INVALID_ORDER_BY = 'INVALID_ORDER_BY';
    const INVALID_TOPIC = 'INVALID_TOPIC';
    const INVALID_SEARCH = 'INVALID_SEARCH';
    const INVALID_ORDER = 'INVALID_ORDER';
    const INVALID_USER = 'INVALID_USER';
    const ALREADY_BANNED = 'ALREADY_BANNED';
    const INVALID_LEVEL = 'INVALID_LEVEL';
    const ALREADY_A_STAFF = 'ALREADY_A_STAFF';
    const INVALID_STAFF = 'INVALID_STAFF';
    const SAME_DEPARTMENT = 'SAME_DEPARTMENT';
    const INVALID_TOKEN = 'INVALID_TOKEN';
    const UNVERIFIED_USER = 'UNVERIFIED_USER';
    const INVALID_TEMPLATE = 'INVALID_TEMPLATE';
    const INVALID_SUBJECT = 'INVALID_SUBJECT';
    const INVALID_BODY = 'INVALID_BODY';
    const USER_SYSTEM_ENABLED = 'USER_SYSTEM_ENABLED';
    const USER_SYSTEM_DISABLED = 'USER_SYSTEM_DISABLED';
    const SYSTEM_USER_IS_ALREADY_DISABLED = 'SYSTEM_USER_IS_ALREADY_DISABLED';
    const SYSTEM_USER_IS_ALREADY_ENABLED = 'SYSTEM_USER_IS_ALREADY_ENABLED';
    const INVALID_PERIOD = 'INVALID_PERIOD';
    const NAME_ALREADY_USED = 'NAME_ALREADY_USED';
    const INVALID_FILE = 'INVALID_FILE';
    const DATABASE_CONNECTION = 'DATABASE_CONNECTION';
    const DATABASE_CREATION = 'DATABASE_CREATION';
    const SMTP_CONNECTION = 'SMTP_CONNECTION';
    const IMAP_CONNECTION = 'IMAP_CONNECTION';
    const ALREADY_DISABLED = 'ALREADY_DISABLED';
    const ALREADY_ENABLED = 'ALREADY_ENABLED';
    const USER_DISABLED = 'USER_DISABLED';
    const INVALID_TEXT_1 = 'INVALID_TEXT_1';
    const INVALID_TEXT_2 = 'INVALID_TEXT_2';
    const INVALID_TEXT_3 = 'INVALID_TEXT_3';
    const DEPARTMENT_PRIVATE_TICKETS = 'DEPARTMENT_PRIVATE_TICKETS';
    const EMAIL_POLLING = 'EMAIL_POLLING';
    const CUSTOM_FIELD_ALREADY_EXISTS = 'CUSTOM_FIELD_ALREADY_EXISTS';
    const INVALID_CUSTOM_FIELD = 'INVALID_CUSTOM_FIELD';
    const INVALID_CUSTOM_FIELD_TYPE = 'INVALID_CUSTOM_FIELD_TYPE';
    const INVALID_CUSTOM_FIELD_OPTIONS = 'INVALID_CUSTOM_FIELD_OPTIONS';
    const INVALID_CUSTOM_FIELD_OPTION = 'INVALID_CUSTOM_FIELD_OPTION';
    const UNAVAILABLE_STATS = 'UNAVAILABLE_STATS';
    const INVALID_COLOR = 'INVALID_COLOR';
    const INVALID_API_KEY_TYPE = 'INVALID_API_KEY_TYPE';
}
