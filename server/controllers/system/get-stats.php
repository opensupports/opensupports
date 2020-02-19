<?php
use Respect\Validation\Validator as DataValidator;
use RedBeanPHP\Facade as RedBean;

/**
 * @api {post} /system/get-stats Get stats
 * @apiVersion 4.6.1
 *
 * @apiName Get stats
 *
 * @apiGroup System
 *
 * @apiDescription This path retrieves the last stats.
 *
 * @apiPermission staff1
 *
 * @apiParam {String} period Period of search.
 * @apiParam {Number} staffId Id of the current staff.

 * @apiUse NO_PERMISSION
 * @apiUse INVALID_PERIOD
 *
 * @apiSuccess {[StatList](#api-Data_Structures-ObjectStatlist)[]} data Array of the stats
 *
 */

class GetStatsController extends Controller {
    const PATH = '/get-stats';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'staff_1',
            'requestData' => [
                'period' => [
                    'validation' => DataValidator::in(['WEEK', 'MONTH', 'QUARTER', 'YEAR']),
                    'error' => ERRORS::INVALID_PERIOD
                ]
            ]
        ];
    }

    public function handler() {
        throw new ValidationException(ERRORS::UNAVAILABLE_STATS);
        /*
        $this->generateNewStats();
        $this->deleteLastStats();

        $staffId = Controller::request('staffId');

        if($staffId) {
            if($staffId !== Controller::getLoggedUser()->id && !Controller::isStaffLogged(3)) {
                throw new RequestException(ERRORS::NO_PERMISSION);
                return;
            }

            $this->getStaffStat();
        } else {
            $this->getGeneralStat();
        }*/
    }

    public function generateNewStats() {
        $lastStatDay = Setting::getSetting('last-stat-day');
        $previousCurrentDate = floor(Date::getPreviousDate() / 10000);
        $currentDate = floor(Date::getCurrentDate() / 10000);

        if($lastStatDay->value !== $previousCurrentDate) {

            $begin = new DateTime($lastStatDay->value);
            $end = new DateTime($currentDate);

            $interval = new DateInterval('P1D');
            $dateRange = new DatePeriod($begin, $interval ,$end);

            $staffList = Staff::getAll();

            foreach($dateRange as $date) {
                $this->generateGeneralStat('CREATE_TICKET', $date);
                $this->generateGeneralStat('CLOSE', $date);
                $this->generateGeneralStat('SIGNUP', $date);
                $this->generateGeneralStat('COMMENT', $date);

                foreach($staffList as $staff) {
                    $assignments = Ticketevent::count('type=? AND author_staff_id=? AND date LIKE ?',['ASSIGN',$staff->id, $date->format('Ymd') . '%']);
                    $closed = Ticketevent::count('type=? AND author_staff_id=? AND date LIKE ?',['CLOSE',$staff->id, $date->format('Ymd') . '%']);

                    $statAssign = new Stat();
                    $statAssign->setProperties([
                        'date' => $date->format('Ymd'),
                        'type' => 'ASSIGN',
                        'general' => 0,
                        'value' => $assignments,
                    ]);

                    $statClose = new Stat();
                    $statClose->setProperties([
                        'date' => $date->format('Ymd'),
                        'type' => 'CLOSE',
                        'general' => 0,
                        'value' => $closed,
                    ]);

                    $staff->ownStatList->add($statAssign);
                    $staff->ownStatList->add($statClose);

                    $staff->store();
                }
            }

            $lastStatDay->value = $currentDate;
            $lastStatDay->store();
        }
    }

    public function deleteLastStats() {
        $removeOlderThanDays = 31;
        $oldDate = floor(Date::getPreviousDate($removeOlderThanDays) / 10000);

        RedBean::exec("DELETE FROM stat WHERE date < $oldDate");
    }

    public function generateGeneralStat($type, $date) {
        $value = Log::count('type=? AND date LIKE ?',[$type, $date->format('Ymd') . '%']);
        $stat = new Stat();

        $stat->setProperties([
            'date' => $date->format('Ymd'),
            'type' => $type,
            'general' => 1,
            'value' => $value,
        ]);

        $stat->store();
    }

    public  function getGeneralStat() {
        $daysToRetrieve = $this->getDaysToRetrieve();

        $statList = Stat::find('general=\'1\' ORDER BY id desc LIMIT ? ', [4 * $daysToRetrieve]);

        Response::respondSuccess($statList->toArray());
    }

    public function getStaffStat() {
        $staffId = Controller::request('staffId');
        $daysToRetrieve = $this->getDaysToRetrieve();

        $statList = Stat::find('general=\'0\' AND staff_id=? ORDER BY id desc LIMIT ? ', [$staffId, 4 * $daysToRetrieve]);

        Response::respondSuccess($statList->toArray());
    }

    public function getDaysToRetrieve() {
        $period = Controller::request('period');
        $daysToRetrieve = 0;

        switch ($period) {
            case 'WEEK':
                $daysToRetrieve = 7;
                break;
            case 'MONTH':
                $daysToRetrieve = 30;
                break;
            case 'QUARTER':
                $daysToRetrieve = 90;
                break;
            case 'YEAR':
                $daysToRetrieve = 365;
                break;
        }

        return $daysToRetrieve;
    }
}
