import React     from 'react/addons';
import _         from 'lodash';

var reactDFS = function (children, visitFunction) {
    var stack = [];

    React.Children.forEach(children, child => stack.push(child));
    stack.reverse();

    while(stack.length) {
        let element = stack.pop();
        let tempChilds = [];
        React.Children.forEach(element.props.children, child => tempChilds.push(child));

        visitFunction(element);
        stack = stack.concat(tempChilds.reverse());
    }
};

var renderChildrenWithProps = function(children, mapFunction) {
    if (typeof children !== 'object' || children === null) {
        return children;
    }

    return React.Children.map(children, function (child) {
        var props = mapFunction(child);

        if (typeof child !== 'object' || child === null) {
            return child;
        }

        if (!_.isEmpty(props)) {
            return React.cloneElement(child, props, child.props && child.props.children);
        } else {
            return React.cloneElement(child, {}, renderChildrenWithProps(child.props && child.props.children, mapFunction));
        }
    }.bind(this));
};

export default {
    renderChildrenWithProps,
    reactDFS
};