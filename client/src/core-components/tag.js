import React from 'react';
import Icon from 'core-components/icon';
import classNames from 'classnames';

class Tag extends React.Component {

    static propTypes = {
        name: React.PropTypes.node,
        color: React.PropTypes.string,
        showDeleteButton: React.PropTypes.bool,
        onRemoveClick: React.PropTypes.func,
        size: React.PropTypes.oneOf(['small','medium','large'])
    };

    render() {
        return (
            <div className={this.getClass()} style={{backgroundColor:this.props.color}} onClick={event => event.stopPropagation()} >
                <span className="tag__name">{this.props.name}</span>
                <span>
                    {this.props.showEditButton ? this.renderEditButton() : null}
                    {this.props.showDeleteButton ? this.renderRemoveButton() : null}
                </span>
            </div>
        );
    }

    renderEditButton() {
        return (
            <span onClick={this.props.onEditClick} className="tag__edit" >
                <Icon name="pencil" size="small"/>
            </span>
        );
    }

    renderRemoveButton() {
        return (
            <span onClick={this.props.onRemoveClick} className="tag__remove" >
                <Icon name="times-circle" size="small"/>
            </span>
        );
    }

    getClass() {
        let classes = {
            'tag': true,
            'tag_small': this.props.size === 'small',
            'tag_medium': this.props.size === 'medium',
            'tag_large': this.props.size === 'large',
        };

        return classNames(classes);
    }
}
export default Tag;
