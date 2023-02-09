import React from 'react';
import {Link} from 'react-router';

class BreadCrumb extends React.Component {
    static propTypes = {
        items: React.PropTypes.arrayOf(React.PropTypes.shape({
            content: React.PropTypes.string.isRequired,
            url: React.PropTypes.string
        }))
    };

    render() {
        return (
            <ol className="breadcrumb">
                {this.props.items.map(this.renderItem.bind(this))}
            </ol>
        );
    }

    renderItem(item, index) {
        return (
            <li className="breadcrumb__item" key={index}>
                {(item.url) ? this.renderItemLink(item) : item.content}
                {(index < this.props.items.length - 1) ? this.renderArrow() : null}
            </li>
        );
    }

    renderItemLink(item) {
        return (
            <Link to={item.url}>{item.content}</Link>
        );
    }

    renderArrow() {
        return (
            <span className="breadcrumb__arrow">{'>'}</span>
        );
    }
}

export default BreadCrumb;