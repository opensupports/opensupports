import React from 'react';

class Table extends React.Component {
    static propTypes = {
        headers: React.PropTypes.arrayOf(React.PropTypes.string),
        rows: React.PropTypes.arrayOf(React.PropTypes.arrayOf(React.PropTypes.node)),
        type: React.PropTypes.oneOf(['default'])
    };

    static defaultProps = {
        type: 'default'
    };

    render() {
        return (
            <table className="table">
                <tr className="table__header">
                    {this.props.headers.map(this.renderHeaderColumn.bind(this))}
                </tr>
                {this.props.rows.map(this.renderRow.bind(this))}
            </table>
        );
    }

    renderHeaderColumn(header) {
        return (
            <th className="table__header-column">{header}</th>
        );
    }

    renderRow(row) {
        return (
            <tr className="table__row">
                {row.map((cell) =><td className="table__cell">{cell}</td>)}
            </tr>
        );
    }
}

export default Table;