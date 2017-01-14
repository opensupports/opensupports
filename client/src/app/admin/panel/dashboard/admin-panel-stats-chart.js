import React from 'react';
import {Line} from 'react-chartjs-2';

class StatsChart extends React.Component {

    static propTypes = {
        strokes: React.PropTypes.arrayOf(React.PropTypes.shape({
            name: React.PropTypes.string,
            values: React.PropTypes.arrayOf(React.PropTypes.shape({
                date: React.PropTypes.string,
                value: React.PropTypes.number
            }))
        })),
        display: React.PropTypes.number
    };

    render() {
        return (
            <div>
                <Line data={this.getChartData()} options={this.getChartOptions()} width="800" height="400" />
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

        let color = {
            'CREATE_TICKET': 'rgba(150, 20, 20)',
            'CLOSE': 'rgba(20, 150, 20)',
            'SIGNUP': 'rgba(20, 20, 150)',
            'COMMENT': 'rgba(150, 150, 20)'
        };

        let datasets = [];

        for (let i = 0; i < this.props.strokes.length; i++) {
            let stroke = this.props.strokes[i];

            let dataset = {};
            dataset.label = stroke.name;
            dataset.data = [];
            dataset.fill = false;

            console.log('FUCK THIS PITCH BEF ' + stroke.values.length);
            for (let j = 0; j < stroke.values.length; j++) {
                console.log('OH YEAH: ' + stroke.values[j].value);
                dataset.data.push(stroke.values[j].value);
                console.log('OH YEAH x2');
            }
            console.log('FUCK THIS PITCH AFT');

            dataset.borderWidth = 4;
            dataset.borderColor = color[stroke.name];
            dataset.pointRadius = 0;
            dataset.lineTension = 0.2;
            dataset.hitRadius = this.hitRadius();

            datasets.push(dataset);
        }

        return {
            labels: labels,
            datasets: datasets
        };
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