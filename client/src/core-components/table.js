import React from 'react';
import classNames from 'classnames';

class Table extends React.Component {
    static propTypes = {
        headers: React.PropTypes.arrayOf(React.PropTypes.shape({
            key: React.PropTypes.string,
            value: React.PropTypes.string,
            className: React.PropTypes.string
        })),
        rows: React.PropTypes.arrayOf(React.PropTypes.object),
        type: React.PropTypes.oneOf(['default'])
    };

    static defaultProps = {
        type: 'default'
    };

    render() {
        return (
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
        let headersKeys = this.props.headers.map(header => header.key);

        return (
            <tr className={this.getRowClass(row)} key={index}>
                {headersKeys.map(this.renderCell.bind(this, row))}
            </tr>
        );
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
    
    getRowClass(row) {
        let classes = {
            'table__row': true,
            'table__row-highlighted': row.highlighted
        };
        
        return classNames(classes);
    }
}

export default Table;