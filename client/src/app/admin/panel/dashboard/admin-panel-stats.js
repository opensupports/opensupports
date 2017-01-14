import React from 'react';
import _ from 'lodash';

import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';

import Header from 'core-components/header';
import DropDown from 'core-components/drop-down';
import ToggleList from 'core-components/toggle-list';

import StatsChart from 'app/admin/panel/dashboard/admin-panel-stats-chart';

class AdminPanelStats extends React.Component {

    state = {
        stats: {
            'CLOSE': 0,
            'CREATE_TICKET': 0,
            'SIGNUP': 0,
            'COMMENT': 0
        },
        strokes: [
            {
                name: 'CLOSE',
                show: true,
                values: []
            },
            {
                name: 'CREATE_TICKET',
                show: true,
                values: []
            },
            {
                name: 'SIGNUP',
                show: true,
                values: []
            },
            {
                name: 'COMMENT',
                show: true,
                values: []
            }
        ],
        period: 0
    };

    componentDidMount() {
        this.retrieve();
    }

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
                    content:
                        <div>
                            {this.state.stats['CREATE_TICKET']}
                            <div>{i18n('CHART_CREATE_TICKET')}</div>
                        </div>
                },
                {
                    content:
                        <div>
                            {this.state.stats['CLOSE']}
                            <div>{i18n('CHART_CLOSE')}</div>
                        </div>
                },
                {
                    content:
                        <div>
                            {this.state.stats['SIGNUP']}
                            <div>{i18n('CHART_SIGNUP')}</div>
                        </div>
                },
                {
                    content:
                        <div>
                            {this.state.stats['COMMENT']}
                            <div>{i18n('CHART_COMMENT')}</div>
                        </div>
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

        console.log('This is the shit');
        console.log(this.state.strokes);

        return {
            period: this.state.period,
            strokes: this.state.strokes
            /*strokes: [
                {
                    name: 'COMMENT',
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
            ]*/
        }
    }

    retrieve() {
        API.call({
            path: '/system/get-stats',
            data: {}
        }).then(this.onRetrieveSuccess.bind(this));
    }

    onRetrieveSuccess(result) {

        let newState = {
            'CLOSE': 0,
            'CREATE_TICKET': 0,
            'SIGNUP': 0,
            'COMMENT': 0
        };

        let ID = {
            'CLOSE': 0,
            'CREATE_TICKET': 1,
            'SIGNUP': 2,
            'COMMENT': 3
        };

        let newStrokes = [
            {
                name: 'CLOSE',
                show: true,
                values: []
            },
            {
                name: 'CREATE_TICKET',
                show: true,
                values: []
            },
            {
                name: 'SIGNUP',
                show: true,
                values: []
            },
            {
                name: 'COMMENT',
                show: true,
                values: []
            }
        ];

        for (let i = 0; i < result.data.length; i++) {
            newState[result.data[i].type] += result.data[i].value * 1;

            newStrokes[ ID[result.data[i].type] ].values.push({
                date: result.data[i].date,
                value: result.data[i].value * 1
            });
        }

        this.setState({stats: newState, strokes: newStrokes, period: 7});
    }
}

export default AdminPanelStats;