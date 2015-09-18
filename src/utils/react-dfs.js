import React     from 'react/addons';

var reactDFS = function (children, visitFunction) {
    var stack = [];

    React.Children.forEach(children, child => stack.push(child));
    stack.reverse();

    while(stack.length) {
        let element = stack.pop();
        let tempChilds = [];
        React.Children.forEach(element.props.children, child => tempChilds.push(child));

        visitFunction(element);
        stack.concat(tempChilds.reverse());
    }
};

export default reactDFS;