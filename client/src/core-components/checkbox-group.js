import React from 'react';
import _ from 'lodash';

import Checkbox from 'core-components/checkbox';

class CheckboxGroup extends React.Component {
    static propTypes = {
        items: React.PropTypes.array.isRequired,
        value: React.PropTypes.arrayOf(React.PropTypes.number),
        onChange: React.PropTypes.func
    };
    
    state = {
        value: []
    };
    
    render() {
        return (
            <ul className="checkbox-group">
                {this.props.items.map(this.renderItem.bind(this))}
            </ul>
        );
    }
    
    renderItem(label, index) {
        const checked = (_.includes(this.getValue(), index));
        
        return (
            <li className="checkbox-group__item" key={index}>
                <Checkbox label={label} checked={checked} onChange={this.onCheckboxChange.bind(this, index)} wrapInLabel/>
            </li>
        );
    }
    
    onCheckboxChange(index) {
        let value = _.clone(this.getValue());
        
        if(_.includes(value, index)) {
            _.pull(value, index);
        } else {
            value.push(index);
            value.sort();
        }
        
        this.setState({value});
        
        if(this.props.onChange) {
            this.props.onChange({target: {value}});
        }
    }
    
    getValue() {
        return (this.props.value !== undefined) ? this.props.value : this.state.value;
    }
}

export default CheckboxGroup;