const React = require('react');
const classNames = require('classnames');

const Widget = require('core-components/widget');

const MainHomePagePortal = React.createClass({
    render() {
        return (
            <Widget className={classNames('main-home-page-portal', this.props.className)}>
                support portal
            </Widget>
        );
    }
});

export default MainHomePagePortal;