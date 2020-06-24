import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';

import Pagination from 'core-components/pagination';
import Icon from 'core-components/icon';
import Loading from 'core-components/loading';

class Table extends React.Component {
    static propTypes = {
        headers: React.PropTypes.arrayOf(React.PropTypes.shape({
            key: React.PropTypes.string,
            value: React.PropTypes.node,
            className: React.PropTypes.string
        })),
        rows: React.PropTypes.arrayOf(React.PropTypes.object),
        loading: React.PropTypes.bool,
        type: React.PropTypes.oneOf(['default']),
        page: React.PropTypes.number,
        pages: React.PropTypes.number,
        pageSize: React.PropTypes.number,
        onPageChange: React.PropTypes.func,
        comp: React.PropTypes.func
    };

    static defaultProps = {
        type: 'default'
    };

    state = {
        page: 1
    };

    render() {
        return (
            <div className={this.getClass()}>
                <table className="table table-responsive">
                    <thead>
                        <tr className="table__header">
                            {this.props.headers.map(this.renderHeaderColumn.bind(this))}
                        </tr>
                    </thead>
                    <tbody>
                        {(!this.props.loading) ? this.getRows().map(this.renderRow.bind(this)) : null}
                    </tbody>
                </table>
                {(this.props.loading) ? this.renderLoading() : null}
                {this.renderPagination()}
            </div>
        );
    }

    renderHeaderColumn(header) {
        let classes = {
            'table__header-column': true,
            [header.className]: (header.className)
        };

        return (
            <th className={classNames(classes)} key={header.key}>
                {header.value}
                {(header.order) ? this.renderHeaderArrows(header.onOrderUp, header.onOrderDown) : null}
            </th>
        );
    }

    renderHeaderArrows(onArrowUp, onArrowDown) {
        return (
            <span className="table__header-arrows">
                <span className="table__header-arrow-up" onClick={onArrowUp}>
                    <Icon name="arrow-up"/>
                </span>
                <span className="table__header-arrow-down" onClick={onArrowDown}>
                    <Icon name="arrow-down"/>
                </span>
            </span>
        );
    }

    renderRow(row, index) {
        const headersKeys = this.props.headers.map(header => header.key);
        const minIndex = this.props.pageSize * ((this.props.page) ? 0 : this.state.page - 1);
        const maxIndex = this.props.pageSize * ((this.props.page) ? 1 : this.state.page);
        const shouldRenderRow = !this.props.pageSize || (index >= minIndex && index < maxIndex);

        return (shouldRenderRow) ? (
            <tr className={this.getRowClass(row)} key={index}>
                {headersKeys.map(this.renderCell.bind(this, row))}
            </tr>
        ) : null;
    }

    renderCell(row, key, index) {
        let classes = {
            'table__cell': true,
            [this.props.headers[index].className]: (this.props.headers[index].className)
        };

        return (
            <td className={classNames(classes)} key={key}>{row[key]}</td>
        );
    }

    renderPagination() {
        return (
            (this.props.pages || (this.props.pageSize && this.props.rows.length > this.props.pageSize)) ?
                this.renderNavigation() :
                null
        )
    }

    renderNavigation() {
        return (
            <Pagination
                className="table__navigation"
                page={this.getPageNumber()}
                pages={this.getPages()}
                onChange={this.onNavigationChange.bind(this)}
                tabbable />
        );
    }

    renderLoading() {
        return (
            <div className="table__loading-wrapper">
                <Loading className="table__loading" backgrounded size="large"/>
            </div>
        )
    }

    getClass() {
        let classes = {
            'table__wrapper': true
        };

        classes[this.props.className] = (this.props.className);

        return classNames(classes);
    }

    onNavigationChange(index) {
        this.setState({
            page: index
        });

        if(this.props.onPageChange) {
            this.props.onPageChange({target: {value: index}});
        }
    }

    getRowClass(row) {
        let classes = {
            'table__row': true,
            'table__row-highlighted': row.highlighted
        };

        classes[row.className] = (row.className);

        return classNames(classes);
    }

    getRows() {
        let sortedRows = _.clone(this.props.rows);
        sortedRows.sort(this.props.comp);

        return sortedRows;
    }

    getPages() {
        return (this.props.pages !== undefined) ? this.props.pages : Math.ceil(this.props.rows.length / this.props.pageSize);
    }

    getPageNumber() {
        return (this.props.page !== undefined) ? this.props.page: this.state.page;
    }
}

export default Table;
