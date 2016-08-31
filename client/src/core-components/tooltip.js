import React from 'react'

class Tooltip extends React.Component {
    
    static propTypes = {
        children: React.PropTypes.node,
        content: React.PropTypes.node
    };
    constructor (props){
        super(props);
        this.state = {show : false}
    }
    render (){
        return (
            <div className="tooltip" >
                {(this.state.show) ? this.renderMessage() : null}
                <div className="tooltip__children" onClick={this.onClick.bind(this)}>{this.props.children}</div>
            </div>
        );
    }
    renderMessage(){
        return (
            <div className="tooltip__message">
                {this.props.content}
            </div>
        )
    }
    onClick(){
        if(this.state.show){
            this.setState({show : false});
        }else{
            this.setState({show : true});
        }


    }
}


export default Tooltip;