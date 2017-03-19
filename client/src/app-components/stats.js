import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';

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
            <div className={this.getClass()}>
                <DropDown {...this.getDropDownProps()}/>
                <ToggleList {...this.getToggleListProps()} />
                <StatsChart {...this.getStatsChartProps()} />
            </div>
        );
    }

    getClass() {
        let classes = {
            'stats': true,
            'stats_staff': this.props.type === 'staff'
        };
        
        return classNames(classes);
    }

    getToggleListProps() {
        return {
            values: this.state.showed,
            className: 'stats__toggle-list',
            onChange: this.onToggleListChange.bind(this),
            type: this.props.type === 'general' ? 'default' : 'small',
            items: this.getStrokes().map((name) => {
                return {
                    className: 'stats__toggle-list_' + name,
                    content: (
                        <div className="stats__toggle-list-item">
                            <div className="stats__toggle-list-item-value">{this.state.stats[name]}</div>
                            <div className="stats__toggle-list-item-name">{i18n('CHART_' + name)}</div>
                        </div>
                    )
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
            items: ['Last 7 days', 'Last 30 days', 'Last 90 days', 'Last 365 days'].map((name) => {
                return {
                    content: name,
                    icon: ''
                };
            }),
            onChange: this.onDropDownChange.bind(this),
            className: 'stats__dropdown'
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
        }).then(this.onRetrieveSuccess.bind(this));
    }

    onRetrieveSuccess(result) {
        let newStats = this.getDefaultStats();

        let newStrokes = this.getStrokes().map((name) => {
            return {
                name: name,
                values: []
            };
        });

        let realPeriod = result.data.length / this.getStrokes().length;

        result.data.reverse().map((item) => {
            newStats[item.type] += item.value * 1;

            newStrokes[ ID[item.type] ].values.push({
                date: item.date,
                value: item.value * 1
            });
        });

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

    getApiCallData(periodName) {
        return this.props.type === 'general' ? {period: periodName} : {period: periodName, staffId: this.props.staffId};
    }
}

export default Stats;