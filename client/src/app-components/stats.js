import React from 'react';
import _ from 'lodash';

import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';

import DropDown from 'core-components/drop-down';
import ToggleList from 'core-components/toggle-list';

import StatsChart from 'app-components/stats-chart';

const generalStrokes = ['CREATE_TICKET', 'CLOSE', 'SIGNUP', 'COMMENT'];
const staffStrokes = ['ASSIGN', 'CLOSE'];
const ID = {
    'CREATE_TICKET': 0,
    'ASSIGN': 0,
    'CLOSE': 1,
    'SIGNUP': 2,
    'COMMENT': 3
};

class Stats extends React.Component {

    static propTypes = {
        type: React.PropTypes.string,
        staffId: React.PropTypes.number
    };

    state = {
        stats: this.getDefaultStats(),
        strokes: this.getStrokes().map((name) => {
            return {
                name: name,
                values: []
            } 
        }),
        showed: [0],
        period: 0
    };

    componentDidMount() {
        this.retrieve(7);
    }

    render() {
        return (
            <div>
                <DropDown {...this.getDropDownProps()}/>
                <ToggleList {...this.getToggleListProps()} />
                <StatsChart {...this.getStatsChartProps()} />
            </div>
        );
    }

    getToggleListProps() {
        return {
            values: this.state.showed,
            className: this.getClassPrefix() + '__toggle-list',
            onChange: this.onToggleListChange.bind(this),
            items: this.getStrokes().map((name) => {
                return {
                    content:
                        <div className={this.getClassPrefix() + '__toggle-list-item'}>
                            <div className={this.getClassPrefix() + '__toggle-list-item-value'}>{this.state.stats[name]}</div>
                            <div className={this.getClassPrefix() + '__toggle-list-item-name'}>{i18n('CHART_' + name)}</div>
                        </div>
                }
            })
        };
    }

    onToggleListChange(event) {
        this.setState({
            showed: event.target.value
        });
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
            onChange: this.onDropDownChange.bind(this),
            className: this.getClassPrefix() + '__dropdown'
        }
    }

    onDropDownChange(event) {
        let val = [7, 30, 90, 365];

        this.retrieve(val[event.index]);
    }

    getStatsChartProps() {
        let showed = this.getShowedArray();

        return {
            period: this.state.period,
            strokes: _.filter(this.state.strokes, (s, i) => showed[i])
        };
    }

    retrieve(period) {
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

        API.call({
            path: '/system/get-stats',
            data: this.getApiCallData(periodName)
            /*data: {
                period: periodName
            }*/
        }).then(this.onRetrieveSuccess.bind(this, period));
    }

    onRetrieveSuccess(period, result) {
        let newStats = this.getDefaultStats();

        let newStrokes = this.getStrokes().map((name) => {
            return {
                name: name,
                values: []
            };
        });

        let realPeriod = result.data.length / this.getStrokes().length;

        for (let i = 0; i < result.data.length; i++) {
            newStats[result.data[i].type] += result.data[i].value * 1;

            newStrokes[ ID[result.data[i].type] ].values.push({
                date: result.data[i].date,
                value: result.data[i].value * 1
            });
        }

        this.setState({stats: newStats, strokes: newStrokes, period: realPeriod});
    }

    getShowedArray() {
        let showed = this.getStrokes().map(() => false);

        for (let i = 0; i < showed.length; i++) {
            showed[this.state.showed[i]] = true;
        }

        return showed;
    }
    
    getStrokes() {
        return this.props.type === 'general' ? generalStrokes : staffStrokes;
    }

    getDefaultStats() {
        return this.props.type === 'general' ?
        {
            'CREATE_TICKET': 0,
            'CLOSE': 0,
            'SIGNUP': 0,
            'COMMENT': 0
        } :
        {
            'ASSIGN': 0,
            'CLOSE': 0
        };
    }

    getClassPrefix() {
        return this.props.type === 'general' ? 'admin-panel-stats' : 'ANOTHER_ONE'; /// IMPORTANTE...
    }

    getApiCallData(periodName) {
        return this.props.type === 'general' ? {period: periodName} : {period: periodName, staffId: this.props.staffId};
    }
}

export default Stats;