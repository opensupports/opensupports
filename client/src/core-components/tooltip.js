import React from 'react'
import {Motion, spring} from 'react-motion';

class Tooltip extends React.Component {
    
    static propTypes = {
        children: React.PropTypes.node,
        content: React.PropTypes.node,
        openOnHover: React.PropTypes.bool
    };

    state = {
        show : false
    };

    render() {
        return (
            <div {...this.getProps()}>
                {(this.state.show) ? this.renderAnimatedMessage() : null}
                <div {...this.getChildrenProps()}>
                    {this.props.children}
                </div>
            </div>
        );
    }

    renderAnimatedMessage() {
        return (
            <Motion defaultStyle={{opacity:spring(0)}} style={{opacity:spring(1)}}>
                {this.renderMessage.bind(this)}
            </Motion>
        )
    }

    renderMessage(animation) {
        return (
            <div style={animation}>
                <div className="tooltip__message">
                    {this.props.content}
                </div>
                <span className="tooltip__pointer"/>
            </div>
        )
    }

    getProps() {
        let props = {};

        props.className = 'tooltip';

        if(this.props.openOnHover) {
            props.onMouseOver = this.onMouseOver.bind(this);
            props.onMouseOut = this.onMouseOut.bind(this);
        }

        return props;
    }

    getChildrenProps() {
        let props = {};
        props.className= 'tooltip__children';

        if(!this.props.openOnHover) {
            props.onClick= this.onClick.bind(this);
        }

        return props;
    }

    onMouseOver() {
        this.setState({
            show: true
        });
    }
    onMouseOut() {
        this.setState({
            show: false
        });
    }

    onClick() {
        if (this.state.show) {
            this.setState({show: false});
        } else {
            this.setState({show: true});
        }
    }
}

export default Tooltip;