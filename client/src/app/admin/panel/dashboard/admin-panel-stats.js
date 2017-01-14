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
        this.retrieve(7);
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
            ],
            onChange: this.onToggleListChange.bind(this)
        };
    }

    onToggleListChange(data) {

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
            ],
            onChange: this.onDropDownChange.bind(this)
        }
    }

    onDropDownChange(event) {
        console.log('DROP DOWN HAS CHANGED');
        let val = [7, 30, 90, 365];

        this.retrieve(val[event.index]);
    }

    getStatsChartProps() {
        return {
            period: this.state.period,
            strokes: this.state.strokes
        }
    }

    retrieve(period) {
        console.log('THIS SHOULD NOT BE DISPLAYED');

        let periodName;
        switch (period) {
            case 30:
                periodName = 'MONTH';
                break;
            case 90:
                periodName = 'QUARTER';
                break;
            case 365:
                periodName = 'YEAR';
                break;
            default:
                periodName = 'WEEK';
        }

        console.log('--------------------------------------------period: ' + this.state.period);
        console.log('--------------------------------------------PERIOD NAME: ' + periodName);

        API.call({
            path: '/system/get-stats',
            data: {
                period: periodName
            }
        }).then(this.onRetrieveSuccess.bind(this, period));
    }

    onRetrieveSuccess(period, result) {

        console.log('This is the shit you SHOULD look at!');
        console.log(result);

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

        this.setState({stats: newState, strokes: newStrokes, period: period});
    }
}

export default AdminPanelStats;