// VENDOR LIBS
import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';

// CORE LIBS
import Button from 'core-components/button';
import Loading from 'core-components/loading';

class SubmitButton extends React.Component {

    static contextTypes = {
        loading: React.PropTypes.bool
    };

    static propTypes = {
        children: React.PropTypes.node
    };

    static defaultProps = {
        type: 'primary'
    };

    render() {
        return (
            <Button {...this.getProps()}>
                {(this.context.loading) ? this.renderLoading() : this.props.children}
            </Button>
        );
    }

    renderLoading() {
        return (
            <Loading className="submit-button__loader" />
        );
    }

    getProps() {
        return _.extend({}, this.props, {
            disabled: this.context.loading,
            className: this.getClass()
        });
    }

    getClass() {
        let classes = {
            'submit-button': true,
            'submit-button_loading': this.context.loading
        };

        classes[this.props.className] = (this.props.className);

        return classNames(classes);
    }
}

export default SubmitButton;
