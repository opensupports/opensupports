import React from 'react';
import classNames from 'classnames';

import Menu from 'core-components/menu';
import Button from 'core-components/button';
import Icon from 'core-components/icon';

class Listing extends React.Component {
    static propTypes = {
        title: React.PropTypes.string,
        enableAddNew: React.PropTypes.bool,
        items: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
        selectedIndex: React.PropTypes.number,
        onChange: React.PropTypes.func,
        onAddClick: React.PropTypes.func
    };

    static defaultProps = {
        addNewText: 'Add new'
    };

    render() {
        return (
            <div className={this.getClass()}>
                <div className="listing__header">
                    {this.props.title}
                </div>
                <div className="listing__menu">
                    <Menu tabbable type="secondary" selectedIndex={this.props.selectedIndex} items={this.props.items} onItemClick={this.props.onChange}/>
                </div>
                {(this.props.enableAddNew) ? this.renderAddButton() : null}
            </div>
        );
    }

    renderAddButton() {
        return (
            <div className="listing__add">
                <Button type="secondary" size="auto" className="listing__add-button" onClick={this.props.onAddClick}>
                    <Icon name="plus-circle" /> {this.props.addNewText}
                </Button>
            </div>
        );
    }

    getClass() {
        let classes = {
            'listing': true
        };

        classes[this.props.className] = (this.props.className);

        return classNames(classes);
    }

}

export default Listing;