import React from 'react';
import {Line} from 'react-chartjs';

class StatsChart extends React.Component {

    static propTypes = {
        strokes: React.PropTypes.arrayOf(React.PropTypes.shape({
            name: React.PropTypes.string,
            values: React.PropTypes.arrayOf(React.PropTypes.shape({
                date: React.PropTypes.number,
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

    shouldBeDeleted(min, max, num) {
        var rtn = [];
        while (rtn.length < num) {
            rtn.push((Math.random() * (max - min)) + min + ((Math.random() > 0.95) ? 1 : 0));
        }
        return rtn;
    }

    getChartData() {
        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        let labels = [], i;
        for (i = 0; i < this.props.display; i++) {
            console.log(this.props.strokes[0].values[i].date);
            let idx = this.props.strokes[0].values[i].date.slice(4, 6) - 1;
            labels.push( this.props.strokes[0].values[i].date.slice(6, 8) + ' ' +  months[idx]);
        }
        console.log(labels);

        return {
            labels: labels,
            datasets: [
                {
                    label: "My First dataset",
                    fillColor: "rgba(0,0,0,0)",
                    strokeColor: "rgba(1,2,3,1)",
                    pointColor: "rgba(3,2,1,1)",
                    pointStrokeColor: "#333",
                    pointHighlightFill: "#999",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: this.shouldBeDeleted(32, 36, 365)
                },
                {
                    label: "My Second dataset",
                    fillColor: "rgba(0,0,0,0)",
                    strokeColor: "rgba(151,187,205,1)",
                    pointColor: "rgba(151,187,205,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: this.shouldBeDeleted(32, 36, 365)
                }
            ]
        };
    }

    getChartOptions() {
        return {

        };
    }

}


export default StatsChart;