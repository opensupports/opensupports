import React from 'react';
import classNames from 'classnames';

class Loading extends React.Component {
    
    render() {
        return (
            <div className={this.getClass()}>
                <span className="loading-icon" />
            </div>
        );
    }

    getClass() {
        let classes = {
            'loading': true
        };

        classes[this.props.className] = (this.props.className);

        return classNames(classes);
    }
}

export default Loading;