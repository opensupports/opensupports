// VENDOR LIBS
import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';

// CORE LIBS
import Button from 'core-components/button';

const SubmitButton = React.createClass({

    contextTypes: {
        loading: React.PropTypes.bool
    },

    propTypes: {
        children: React.PropTypes.node
    },

    getDefaultProps() {
        return {
            type: 'primary'
        };
    },

    render() {
        return (
            <Button {...this.getProps()}>
                {(this.context.loading) ? this.renderLoading() : this.props.children}
            </Button>
        );
    },

    renderLoading() {
        return (
            <div className="submit-button__loader"></div>
        );
    },

    getProps() {
        return _.extend({}, this.props, {
            disabled: this.context.loading,
            className: this.getClass()
        });
    },

    getClass() {
        let classes = {
            'submit-button': true,
            'submit-button_loading': this.context.loading
        };

        classes[this.props.className] = (this.props.className);

        return classNames(classes);
    }
});

export default SubmitButton;
