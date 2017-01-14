import React from 'react';
import {Line} from 'react-chartjs-2';

import i18n from 'lib-app/i18n';

class StatsChart extends React.Component {

    static propTypes = {
        strokes: React.PropTypes.arrayOf(React.PropTypes.shape({
            name: React.PropTypes.string,
            values: React.PropTypes.arrayOf(React.PropTypes.shape({
                date: React.PropTypes.string,
                show: React.PropTypes.bool,
                value: React.PropTypes.number
            }))
        })),
        display: React.PropTypes.number
    };

    render() {
        return (
            <div>
                <Line data={this.getChartData()} options={this.getChartOptions()} width={800} height={400} />
            </div>
        );
    }

    shouldBeDeleted(min, max, num, type) {
        var rtn = [];
        while (rtn.length < num) {
            rtn.push(Math.floor((Math.random() * (max - min)) + min + ((Math.random() > 0.1) ? type * 3 : 0)));
        }
        return rtn;
    }

    getChartData() {
        let labels = this.getLabels();

        let color = {
            'CREATE_TICKET': 'rgba(150, 20, 20, 0.8)',
            'CLOSE': 'rgba(20, 150, 20, 0.8)',
            'SIGNUP': 'rgba(20, 20, 150, 0.8)',
            'COMMENT': 'rgba(150, 150, 20, 0.8)'
        };

        let datasets = [];

        for (let i = 0; i < this.props.strokes.length; i++) {
            let stroke = this.props.strokes[i];
            console.log(color[stroke.name]);

            let dataset = {
                label: i18n('CHART_' + stroke.name),
                data: stroke.values.map((val) => val.value),
                fill: false,
                borderWidth: 4,
                borderColor: color[stroke.name],
                pointBorderColor: color[stroke.name],
                pointRadius: 0,
                lineTension: 0.2,
                pointHoverBackgroundColor: color[stroke.name],
                hitRadius: this.hitRadius(),
                showLine: stroke.show
            };

            datasets.push(dataset);
        }

        return {
            labels: labels,
            datasets: datasets
        };
    }

    getLabels() {
        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let labels = [];

        for (let i = 0; i < this.props.display; i++) {
            if(i % 2 == 0 && this.props.display > 20){
                labels.push('');
                continue;
            }
            let firstList = this.props.strokes[0];
            let idx = firstList.values[i].date.slice(4, 6) - 1;
            labels.push( firstList.values[i].date.slice(6, 8) + ' ' +  months[idx]);
        }

        return labels;
    }

    hitRadius(name) {
        /// SHOULD AJUSTAR THIS VALUES
        if (this.props.display === 7) return 20;
        if (this.props.display === 30) return 15;
        if (this.props.display === 90) return 10;
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