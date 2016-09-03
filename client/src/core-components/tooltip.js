import React from 'react'
import {Motion, spring} from 'react-motion';

class Tooltip extends React.Component {
    
    static propTypes = {
        children: React.PropTypes.node,
        content: React.PropTypes.node
    };

    constructor (props){
        super(props);
        this.state = {show : false};
    }

    render (){
        return (
            <div className="tooltip" >
                {(this.state.show) ? this.renderAnimatedMessage() : null}
                <div className="tooltip__children" onClick={this.onClick.bind(this)}>{this.props.children}</div>
            </div>
        );
    }

    renderAnimatedMessage(){
        return (
            <Motion defaultStyle={{opacity:spring(0)}} style={{opacity:spring(1)}}>
                {this.renderMessage.bind(this)}
            </Motion>
        )
    }

    renderMessage(animation){
        return (
            <div style={animation}>
                <div className="tooltip__message">
                    {this.props.content}
                </div>
                <span className="tooltip__pointer"/>
            </div>
        )
    }
    onClick(){
        if (this.state.show) {
            this.setState({show : false});
        } else {
            this.setState({show : true});
        }
    }
}

export default Tooltip;