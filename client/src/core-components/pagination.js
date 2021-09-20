import React from 'react';
import _ from 'lodash';

import Menu from 'core-components/menu';

class Pagination extends React.Component {

    static propTypes = {
        pages: React.PropTypes.number.isRequired,
        pageRangeDisplayed: React.PropTypes.number,
        marginPagesDisplayed: React.PropTypes.number,
        page: React.PropTypes.number
    };

    static defaultProps = {
        pageRangeDisplayed: 5,
        marginPagesDisplayed: 2
    };

    state = {
        page: 1
    };

    render() {
        return (
            <Menu {...this.getProps()}/>
        );
    }

    getProps() {
        let props = _.clone(this.props);
        let pageList = this.getItems();

        props.items = pageList.map(page => {return {content: page}});
        props.selectedIndex = _.indexOf(pageList, this.getPage());
        props.onItemClick = this.onItemClick.bind(this);
        props.type = 'navigation';

        delete props.page;
        delete props.pages;
        delete props.pageRangeDisplayed;
        delete props.marginPagesDisplayed;

        return props;
    }

    getItems() {
        const pages = this.props.pages;
        const pageRangeDisplayed = this.props.pageRangeDisplayed;
        const marginPagesDisplayed = this.props.marginPagesDisplayed;
        const page = this.getPage();

        let totalItems = [];

        if(pages <= pageRangeDisplayed + 2 * marginPagesDisplayed) {
            return _.range(1, pages + 1);
        }

        if (page <= pageRangeDisplayed) {
            totalItems = totalItems.concat(_.range(1, (page > pageRangeDisplayed - marginPagesDisplayed + 1) ? pageRangeDisplayed +1 + marginPagesDisplayed : pageRangeDisplayed + 1));
            totalItems.push('...');
            totalItems = totalItems.concat(_.range(pages - marginPagesDisplayed + 1, pages + 1));
        } else {
            totalItems = totalItems.concat(_.range(1, marginPagesDisplayed + 1));
            totalItems.push('...');

            if(page > pages - pageRangeDisplayed) {
                totalItems = totalItems.concat(_.range((page < pages - pageRangeDisplayed + marginPagesDisplayed) ? pages - pageRangeDisplayed - marginPagesDisplayed + 1 : pages - pageRangeDisplayed + 1, pages + 1));
            } else  {
                totalItems = totalItems.concat(_.range(page - Math.floor(pageRangeDisplayed / 2), page + Math.floor(pageRangeDisplayed / 2) + 1));
                totalItems.push('...');
                totalItems = totalItems.concat(_.range(pages - marginPagesDisplayed + 1, pages + 1));
            }
        }

        return totalItems;
    }

    onItemClick(index) {
        let items = this.getItems();
        let page;

        if(items[index] === '...') {
            page = Math.floor((items[index-1] + items[index+1]) / 2);
        } else {
            page = items[index];
        }

        this.setState({page});

        if(this.props.onChange) {
            this.props.onChange(page);
        }
    }

    getPage() {
        return (this.props.page !== undefined) ? this.props.page : this.state.page;
    }
}

export default Pagination;
