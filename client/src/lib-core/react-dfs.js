import React     from 'react';
import _         from 'lodash';

export let reactDFS = function (children, visitFunction) {
    let stack = [];

    React.Children.forEach(children, child => stack.push(child));
    stack.reverse();

    while(stack.length) {
        let element = stack.pop();
        let tempChilds = [];

        if (element) {
            if (element.props && element.props.children) {
                React.Children.forEach(element.props.children, child => tempChilds.push(child));
            }

            visitFunction(element);
        }

        stack = stack.concat(tempChilds.reverse());
    }
};

export let renderChildrenWithProps = function(children, mapFunction) {
    if (typeof children !== 'object' || children === null) {
        return children;
    }

    return React.Children.map(children, function (child) {
        if (typeof child !== 'object' || child === null) {
            return child;
        }

        let props = mapFunction(child);

        if (!_.isEmpty(props)) {
            return React.cloneElement(child, props, child.props && child.props.children);
        } else {
            return React.cloneElement(child, {}, renderChildrenWithProps(child.props && child.props.children, mapFunction));
        }
    }.bind(this));
};
