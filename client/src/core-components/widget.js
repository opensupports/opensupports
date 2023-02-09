import React from 'react';
import classNames from 'classnames';

class Widget extends React.Component {
    static propTypes = {
        title: React.PropTypes.string,
        children: React.PropTypes.node.isRequired
    };

    static defaultProps = {
        title: ''
    };

    render() {
        return (
            <div {...this.props} className={this.getClass()}>
                {this.renderTitle()}
                {this.props.children}
            </div>
        );
    }

    renderTitle() {
        let titleNode = null;

        if (this.props.title) {
            titleNode = <h2 className="widget--title">{this.props.title}</h2>;
        }

        return titleNode;
    }

    getClass() {
        let classes = {
            'widget': true
        };

        classes[this.props.className] = (this.props.className);

        return classNames(classes);
    }
}

export default Widget;
