import React from 'react'
import {Motion, spring} from 'react-motion';

class Tooltip extends React.Component {

    static propTypes = {
        children: React.PropTypes.node,
        content: React.PropTypes.node,
        openOnHover: React.PropTypes.bool,
        show: React.PropTypes.bool,
        onToggle: React.PropTypes.func
    };

    state = {
        show : false
    };

    render() {
        return (
            <div {...this.getProps()}>
                {(this.getShowValue()) ? this.renderAnimatedMessage() : null}
                <div {...this.getChildrenProps()}>
                    {this.props.children}
                </div>
            </div>
        );
    }

    renderAnimatedMessage() {
        return (
            <Motion defaultStyle={{opacity: 0, top: -30}} style={{opacity: spring(1), top: spring(0)}}>
                {this.renderMessage.bind(this)}
            </Motion>
        )
    }

    renderMessage(animation) {
        return (
            <div className="tooltip__animated-container" style={animation}>
                <span className="tooltip__pointer-shadow"/>
                <span className="tooltip__pointer"/>
                <div className="tooltip__message">
                    {this.props.content}
                </div>
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
        props.className = 'tooltip__children';

        if(!this.props.openOnHover) {
            props.onClick = this.onClick.bind(this);
        }

        return props;
    }

    onMouseOver() {
        this.setState({
            show: true
        });

        if(this.props.onToggle) {
            this.props.onToggle(true);
        }
    }

    onMouseOut() {
        this.setState({
            show: false
        });

        if(this.props.onToggle) {
            this.props.onToggle(false);
        }
    }

    onClick() {
        this.setState({
            show: !this.getShowValue()
        });

        if(this.props.onToggle) {
            this.props.onToggle(!this.getShowValue());
        }
    }

    getShowValue() {
        return (this.props.show !== undefined) ? this.props.show : this.state.show;
    }
}

export default Tooltip;
