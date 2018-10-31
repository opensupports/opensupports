import React              from 'react';
import ReactDOM           from 'react-dom';
import classNames         from 'classnames';
import _                  from 'lodash';
import {Motion, spring}   from 'react-motion';
import focus              from 'lib-core/focus';

class WidgetTransition extends React.Component {

    static propTypes = {
        sideToShow: React.PropTypes.string
    };

    static defaultProps = {
        sideToShow: 'front'
    };

    getDefaultAnimation() {
        return {
            rotateY: -90
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.sideToShow != this.props.sideToShow && this.primaryWidget && this.secondaryWidget) {
            this.moveFocusToCurrentSide();
        }
    }

    render() {
        return (
            <Motion defaultStyle={this.getDefaultAnimation()} style={this.getAnimation()}>
                {this.renderChildren.bind(this)}
            </Motion>
        );
    }

    renderChildren(animation) {
        return (
            <div className={this.getClass()}>
                {React.Children.map(this.props.children, (child, index) => {
                    let modifiedChild;

                    if (index === 0) {
                        modifiedChild = React.cloneElement(child, {
                            className: child.props.className + ' widget-transition--widget',
                            style: _.extend ({}, child.props.style, {
                                transform: `rotateY(${(animation.rotateY) ? animation.rotateY: 0}deg)`
                            }),
                            ref: (node) => this.primaryWidget = node
                        });
                    } else {
                        modifiedChild = React.cloneElement(child, {
                            className: child.props.className + ' widget-transition--widget',
                            style: _.extend ({}, child.props.style, {
                                transform: `rotateY(${-180 + animation.rotateY}deg)`
                            }),
                            ref: (node) => this.secondaryWidget = node
                        });
                    }

                    return modifiedChild;
                })}
            </div>
        )
    }

    getClass() {
        let classes = {
            'widget-transition': true,
            [this.props.className]: (this.props.className)
        };

        return classNames(classes);
    }

    getAnimation() {
        return {
            rotateY: (this.props.sideToShow === 'front') ? spring(0, [100, 20]) : spring(180, [100, 20])
        };
    }

    moveFocusToCurrentSide() {
        let currentWidget;
        let previousWidget;

        if (this.props.sideToShow === 'front') {
            currentWidget = this.primaryWidget;
            previousWidget = this.secondaryWidget;
        } else {
            currentWidget = this.secondaryWidget;
            previousWidget = this.primaryWidget;
        }

        currentWidget = ReactDOM.findDOMNode(currentWidget);
        previousWidget = ReactDOM.findDOMNode(previousWidget);

        focus.focusFirstInput(currentWidget);
    }
}

export default WidgetTransition;
