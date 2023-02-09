const React = require('react');
const { PropTypes } = React;
const { TransitionMotion, spring } = require('react-motion');

const RouteTransition = React.createClass({
    propTypes: {
        pathname: PropTypes.string.isRequired
    },

    willEnter() {
        const { children } = this.props;

        return {
            handler: children,
            opacity: spring(0, [200,10])
        };
    },

    willLeave(key, value) {
        return {
            handler: value.handler,
            opacity: spring(0, [200,10])
        };
    },

    getEndValue() {
        const { children, pathname } = this.props;

        return {
            [pathname]: {
                handler: children,
                opacity: spring(1, [200,10])
            }
        };
    },

    render() {
        return (
            <TransitionMotion
                styles={this.getEndValue()}
                willEnter={this.willEnter}
                willLeave={this.willLeave}>
                {interpolated => {
                return (<div className="animated-children">
            {Object.keys(interpolated).map(key =>
                    <div
                        key={`${key}-transition`}
                        style={{
                            position: 'absolute',
                            opacity: interpolated[key].opacity
                        }}
                    >
                        {interpolated[key].handler}
                        {interpolated[key].opacity}
                    </div>
            )}
                </div>);}}

            </TransitionMotion>
        );
    }
});

module.exports = RouteTransition;