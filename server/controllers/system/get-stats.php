<?php
class GetStatsController extends Controller {
    const PATH = '/get-stats';

    public function validations() {
        return [
            'permission' => 'staff_1',
            'requestData' => []
        ];
    }

    public function handler() {
        $begin = new DateTime(Setting::getSetting('last-stat-day')->value);
        $end = new DateTime(Date::getCurrentDate());

        $interval = new DateInterval('P1D');
        $dateRange = new DatePeriod($begin, $interval ,$end);

        foreach($dateRange as $date){
            $numberOfTickets = Log::count('type=? AND date LIKE ?',['CREATE_TICKET', $date->format('Ymd') . '%']);
            $stat = new Stat();

            $stat->setProperties([
                'date' => $date->format('Ymd'),
                'type' => 'CREATE_TICKET',
                'general' => 1,
                'value' => $numberOfTickets,
            ]);
            $stat->store();
        }

        Response::respondSuccess();
    }
}