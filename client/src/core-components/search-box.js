import React from 'react';
import classNames from 'classnames';

import Input from 'core-components/input';
import Icon from 'core-components/icon';
import keyCode from 'keycode';

class SearchBox extends React.Component {

    static searchQueryInList(list, query, startsWith, includes) {
        let match = [];
        let rest = [];

        list.forEach(function (item) {
            if(startsWith(item, query)) {
                match.push(item);
            } else {
                rest.push(item);
            }
        });

        rest.forEach(function (item) {
            if(includes(item, query)) {
                match.push(item);
            }
        });

        return match;
    }

    static propTypes = {
        onSearch: React.PropTypes.func,
        placeholder: React.PropTypes.string,
        searchOnType: React.PropTypes.bool,
        value: React.PropTypes.string
    };

    state = {
        value: '',
        searchOnType: false
    };

    render() {
        return (
            <div className={this.getClass()}>
                <Input
                    className="search-box__text"
                    value={this.getValue()}
                    placeholder={this.props.placeholder}
                    onChange={this.onChange.bind(this)}
                    onKeyDown={this.onKeyDown.bind(this)} />
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

    getValue() {
        return (this.props.value !== undefined) ? this.props.value : this.state.value;
    }

    onChange(event) {
        this.setState({
            value: event.target.value
        });

        if (this.props.searchOnType && this.props.onSearch) {
            this.props.onSearch(event.target.value);
        }
    }

    onKeyDown(event) {
        if(keyCode(event) === 'enter' && this.props.onSearch && !this.props.searchOnType) {
            this.props.onSearch(this.state.value);
        }
    }
}

export default SearchBox;