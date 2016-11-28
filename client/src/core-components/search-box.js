import React from 'react';
import classNames from 'classnames';

import Input from 'core-components/input';
import Icon from 'core-components/icon';
import keyCode from 'keycode';

class SearchBox extends React.Component {

    static propTypes = {
        onSearch: React.PropTypes.func,
        placeholder: React.PropTypes.string
    };

    state = {
        value: ''
    };

    render() {
        return (
            <div className={this.getClass()}>
                <Input className="search-box__text" value={this.state.value} placeholder={this.props.placeholder} onChange={this.onChange.bind(this)} onKeyDown={this.onKeyDown.bind(this)} />
                <span className="search-box__icon">
                    <Icon name="search" />
                </span>
            </div>
        );
    }

    getClass() {
        let classes = {
            'search-box': true
        };

        classes[this.props.className] = (this.props.className);

        return classNames(classes);
    }

    onChange(event) {
        this.setState({
            value: event.target.value
        });
    }

    onKeyDown(event) {
        if(keyCode(event) === 'enter' && this.props.onSearch) {
            this.props.onSearch(this.state.value);
        }
    }
}

export default SearchBox;