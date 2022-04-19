import React from 'react';

import DropDown from 'core-components/drop-down';
import i18n from 'lib-app/i18n';

class PageSizeDropdown extends React.Component {
    static propTypes = {
        value: React.PropTypes.number,
        onChange: React.PropTypes.func,
        pages: React.PropTypes.array
    }

    state = {
        selectedIndex: 1
    }

    render() {
        return (
            <DropDown {...this.props} onChange={this.onChange.bind(this)} items={this.getPages()} selectedIndex={this.state.selectedIndex} />
        )
    }

    getPages() {
        return this.props.pages.map((page) => {
            return {content: `${page} / ${i18n('TICKETS')}`}
        });
    }

    onChange(event) {
        this.setState({
            selectedIndex: event.index
        })
        if(this.props.onChange) {
            this.props.onChange({
                pageSize: this.props.pages[event.index]
            });
        }
    }
}

export default PageSizeDropdown;
