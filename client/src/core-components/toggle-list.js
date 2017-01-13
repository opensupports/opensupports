import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';

class ToggleList extends React.Component {
    static propTypes = {
        items: React.PropTypes.arrayOf(React.PropTypes.shape({
            content: React.PropTypes.node
        })),
        onChange: React.PropTypes.func
    };

    state = {
        selected: []
    };
    
    render() {
        return (
            <div className="toggle-list">
                {this.props.items.map(this.renderItem.bind(this))}
            </div>
        );
    }

    renderItem(obj, index) {

        return (
            <div className={this.getItemClass(index)} onClick={this.selectItem.bind(this, index)} key={index}>
                {obj.content}
            </div>
        );
    }

    getItemClass(index) {
        let classes = {
            'toggle-list__item': true,
            'toggle-list__first-item': (index === 0),
            'toggle-list__selected': _.includes(this.state.selected, index)
        };

        return classNames(classes);
    }

    selectItem(index) {
        let newSelected = _.clone(this.state.selected);

        _.includes(this.state.selected, index) ? _.remove(newSelected, _index => _index == index) : newSelected.push(index);

        this.setState({
            selected: newSelected
        });

        if (this.props.onChange) {
            this.props.onChange({
                target: {
                    value: newSelected
                }
            });
        }
    }
}

export default ToggleList;
