import React from 'react/addons';
import classNames from 'classnames';

let Widget = React.createClass({
    propTypes: {
        title: React.PropTypes.string,
        children: React.PropTypes.node.isRequired
    },

    getDefaultProps() {
        return {
            title: ''
        };
    },

    render() {
        return (
            <div {...this.props} className={this.getClass()}>
                {this.renderTitle()}
                {this.props.children}
            </div>
        );
    },

    renderTitle() {
        let titleNode = null;

        if (this.props.title) {
            titleNode = <h2 className="widget--title">{this.props.title}</h2>;
        }

        return titleNode;
    },

    getClass() {
        let classes = {
            'widget': true
        };

        classes[this.props.className] = (this.props.className);

        return classNames(classes);
    }
});

export default Widget;
