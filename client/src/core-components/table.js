import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';

import Menu from 'core-components/menu';

class Table extends React.Component {
    static propTypes = {
        headers: React.PropTypes.arrayOf(React.PropTypes.shape({
            key: React.PropTypes.string,
            value: React.PropTypes.string,
            className: React.PropTypes.string
        })),
        rows: React.PropTypes.arrayOf(React.PropTypes.object),
        pageSize: React.PropTypes.number,
        type: React.PropTypes.oneOf(['default'])
    };

    static defaultProps = {
        type: 'default'
    };

    state = {
        page: 1
    };

    render() {
        return (
            <div className="table__wrapper">
                <table className="table table-responsive">
                    <thead>
                        <tr className="table__header">
                            {this.props.headers.map(this.renderHeaderColumn.bind(this))}
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.rows.map(this.renderRow.bind(this))}
                    </tbody>
                </table>
                {(this.props.pageSize && this.props.rows.length > this.props.pageSize) ? this.renderNavigation() : null}
            </div>
        );
    }

    renderHeaderColumn(header) {
        let classes = {
            'table__header-column': true,
            [header.className]: (header.className)
        };
        
        return (
            <th className={classNames(classes)} key={header.key}>{header.value}</th>
        );
    }

    renderRow(row, index) {
        const headersKeys = this.props.headers.map(header => header.key);
        let renderCurrentRow = true;

        if (this.props.pageSize && (index >= this.props.pageSize * this.state.page || index < this.props.pageSize * (this.state.page - 1))) {
            renderCurrentRow = false;
        }


        return (renderCurrentRow) ? (
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

    renderNavigation() {
        const pages = Math.ceil(this.props.rows.length / this.props.pageSize) + 1;
        const items = _.range(1, pages).map((index) => {return {content: index};});

        return (
            <Menu className="table__navigation" type="navigation" items={items} onItemClick={this.onNavigationItemClick.bind(this)}/>
        );
    }

    onNavigationItemClick(index) {
        this.setState({
            page: index + 1
        });
    }
    
    getRowClass(row) {
        let classes = {
            'table__row': true,
            'table__row-highlighted': row.highlighted
        };
        
        return classNames(classes);
    }
}

export default Table;