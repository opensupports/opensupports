import React from 'react';
import Icon from 'core-components/icon';
import classNames from 'classnames';

class Card extends React.Component{
    static propTypes = {
        description: React.PropTypes.string,
        title: React.PropTypes.string,
        icon: React.PropTypes.string,
        color: React.PropTypes.string
    };
    
    render() {
        return (
            <div className={this.getClass()}>
                <div className="card__icon"><Icon name={this.props.icon} size="5x"/></div>
                <div className="card__title">{this.props.title}</div>
                <div className="card__description">{this.props.description}</div>
            </div>
        );
    }

    getClass() {
        var classes = {
            'card': true,
            'card_red': (this.props.color === 'red'),
            'card_blue': (this.props.color === 'blue'),
            'card_green': (this.props.color === 'green')
        };

        classes[this.props.className] = (this.props.className);

        return classNames(classes);
    }
}
export default Card;
