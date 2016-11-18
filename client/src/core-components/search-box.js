import React from 'react';

import Input from 'core-components/input';
import Icon from 'core-components/icon';
import keyCode from 'keycode';

class SearchBox extends React.Component {

    static propTypes = {
        onSearch: React.PropTypes.func
    };

    state = {
        value: ''
    };

    render() {
        return (
            <div className="search-box">
                <Input className="search-box__text" value={this.state.value} onChange={this.onChange.bind(this)} onKeyDown={this.onKeyDown.bind(this)} />
                <span className="search-box__icon">
                    <Icon name="search" />
                </span>
            </div>
        );
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