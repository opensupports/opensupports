import React from 'react';

import i18n from 'lib-app/i18n';

import Header from 'core-components/header';
import DropDown from 'core-components/drop-down';
import ToggleList from 'core-components/toggle-list';

import StatsChart from 'app/admin/panel/dashboard/admin-panel-stats-chart';

class AdminPanelStats extends React.Component {

    render() {
        return (
            <div>
                <Header title={i18n('TICKET_ACTIVITY')}/>
                <DropDown {...this.getDropDownProps()}/>
                <ToggleList {...this.getToggleListProps()} />
                <StatsChart {...this.getStatsChartProps()} />
            </div>
        );
    }

    getToggleListProps() {
        return {
            items: [
                {
                    content: <div></div>
                },
                {
                    content: <div></div>
                },
                {
                    content: <div></div>
                },
                {
                    content: <div></div>
                }
            ]
        };
    }

    getDropDownProps() {
        return {
            items: [
                {
                    content: 'Last 7 days',
                    icon: ''
                },
                {
                    content: 'Last 30 days',
                    icon: ''
                },
                {
                    content: 'Last 90 days',
                    icon: ''
                },
                {
                    content: 'Last 365 days',
                    icon: ''
                }
            ]
        }
    }

    getStatsChartProps() {
        return {
            display: 7,
            strokes: [
                {
                    name: 'CREATE_TICKET',
                    show: true,
                    values: [
                        {
                            date: "20160420",
                            value: 17
                        },
                        {
                            date: "20160421",
                            value: 15
                        },
                        {
                            date: "20160422",
                            value: 12
                        },
                        {
                            date: "20160423",
                            value: 9
                        },
                        {
                            date: "20160424",
                            value: 10
                        },
                        {
                            date: "20160425",
                            value: 7
                        },
                        {
                            date: "20160426",
                            value: 5
                        }
                    ]
                },
                {
                    name: 'SIGNUP',
                    show: true,
                    values: [
                        {
                            date: "20160420",
                            value: 3
                        },
                        {
                            date: "20160421",
                            value: 5
                        },
                        {
                            date: "20160422",
                            value: 3
                        },
                        {
                            date: "20160423",
                            value: 4
                        },
                        {
                            date: "20160424",
                            value: 5
                        },
                        {
                            date: "20160425",
                            value: 5
                        },
                        {
                            date: "20160426",
                            value: 6
                        }
                    ]
                },
                {
                    name: 'CLOSE',
                    show: true,
                    values: [
                        {
                            date: "20160420",
                            value: 4
                        },
                        {
                            date: "20160421",
                            value: 7
                        },
                        {
                            date: "20160422",
                            value: 4
                        },
                        {
                            date: "20160423",
                            value: 7
                        },
                        {
                            date: "20160424",
                            value: 9
                        },
                        {
                            date: "20160425",
                            value: 11
                        },
                        {
                            date: "20160426",
                            value: 13
                        }
                    ]
                }
            ]
        }
    }
}

export default AdminPanelStats;