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
        onChange: React.PropTypes.func,
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
        const { className } = this.props;
        let classes = {
            'search-box': true
        };

        classes[className] = (className);

        return classNames(classes);
    }

    getValue() {
        const { value } = this.props;

        return (value !== undefined) ? value : this.state.value;
    }

    onChange(event) {
        const {
            searchOnType,
            onSearch,
            onChange
        } = this.props;

        this.setState({
            value: event.target.value
        });

        onChange && onChange(event.target.value);

        if (searchOnType && onSearch) {
            onSearch(event.target.value);
        }
    }

    onKeyDown(event) {
        const {
            onSearch,
            searchOnType
        } = this.props;

        if(keyCode(event) === 'enter' && onSearch && !searchOnType) {
            onSearch(this.state.value);
            event.preventDefault();
        }
    }
}

export default SearchBox;