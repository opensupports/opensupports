import React from 'react';

import Tooltip from 'core-components/tooltip';

const colors = ['#ff6900', '#fcb900', '#7bdcb5', '#00d084', '#8ed1fc', '#0693e3', '#abb8c3', '#eb144c', '#f78da7', '#9900ef'];

class ColorSelector extends React.Component {
    static propTypes = {
        value: React.PropTypes.string,
        onChange: React.PropTypes.func
    };

    static defaultProps = {
        value: '#ff6900'
    };

    state = {
        show: false
    };

    render() {
        return (
            <div className="color-selector">
                <Tooltip content={this.renderTooltipContent()} show={this.state.show} onToggle={(show) => this.setState({show})}>
                    <span className="color-selector__current" style={{backgroundColor: this.props.value}} />
                </Tooltip>
            </div>
        )
    }

    renderTooltipContent() {
        return (
            <div className="color-selector__tooltip">
                {colors.map(this.renderTooltipColor.bind(this))}
            </div>
        );
    }

    renderTooltipColor(color, index) {
        return (
            <span className="color-selector__tooltip-color" onClick={this.onColorClick.bind(this, color)} style={{backgroundColor: color}} key={index}/>
        );
    }

    onColorClick(color) {
        this.setState({
            show: false
        });

        if(this.props.onChange) {
            this.props.onChange({target: {value: color}});
        }
    }
}


export default ColorSelector;