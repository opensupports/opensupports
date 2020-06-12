import React from 'react';
import {Line} from 'react-chartjs-2';

import i18n from 'lib-app/i18n';

class StatsChart extends React.Component {

    static propTypes = {
        strokes: React.PropTypes.arrayOf(React.PropTypes.shape({
            name: React.PropTypes.string,
            values: React.PropTypes.arrayOf(React.PropTypes.shape({
                date: React.PropTypes.string,
                value: React.PropTypes.number
            }))
        })),
        period: React.PropTypes.number
    };

    render() {
        return (
            <div>
                <Line data={this.getChartData()} options={this.getChartOptions()} width={800} height={400} redraw />
            </div>
        );
    }

    getChartData() {
        let labels = this.getLabels();

        let color = {
            'CLOSE': 'rgba(150, 20, 20, 0.6)',
            'CREATE_TICKET': 'rgba(20, 150, 20, 0.6)',
            'SIGNUP': 'rgba(20, 20, 150, 0.6)',
            'COMMENT': 'rgba(20, 200, 200, 0.6)',
            'ASSIGN': 'rgba(20, 150, 20, 0.6)'
        };

        let strokes = this.props.strokes.slice();
        let datasets = strokes.map((stroke, index) => {
            return {
                label: i18n('CHART_' + stroke.name),
                data: stroke.values.map((val) => val.value),
                fill: false,
                borderWidth: this.getBorderWidth(),
                borderColor: color[stroke.name],
                pointBorderColor: color[stroke.name],
                pointRadius: 0,
                pointHoverRadius: 3,
                lineTension: 0.2,
                pointHoverBackgroundColor: color[stroke.name],
                hitRadius: this.hitRadius(index)
            }
        });

        return {
            labels: labels,
            datasets: datasets
        };
    }

    getBorderWidth() {
        return (this.props.period <= 90) ? 3 : 2;
    }

    getLabels() {
        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let labels = [];

        if (!this.props.strokes.length) {
            labels = Array.from('x'.repeat(this.props.period));
        }
        else {
            labels = this.props.strokes[0].values.map((item) => {
                let idx = item.date.slice(4, 6) - 1;

                return item.date.slice(6, 8) + ' ' +  months[idx];
            });
        }

        return labels;
    }

    hitRadius(index) {
        if (this.props.period <= 7) return 20;
        if (this.props.period <= 30) return 15;
        if (this.props.period <= 90) return 10;
        return 3;
    }

    getChartOptions() {
        return {
            legend: {
                display: false
            }
        };
    }
}


export default StatsChart;