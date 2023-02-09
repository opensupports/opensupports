import React from 'react';
import classNames from 'classnames';

class Loading extends React.Component {
    static propTypes = {
        backgrounded: React.PropTypes.bool,
        size: React.PropTypes.oneOf(['small', 'medium', 'large'])
    };

    static defaultProps = {
        size: 'small',
        backgrounded: false
    };
    
    render() {
        return (
            <div className={this.getClass()}>
                <span className="loading__icon" />
            </div>
        );
    }

    getClass() {
        let classes = {
            'loading': true,
            'loading_backgrounded': (this.props.backgrounded),
            'loading_large': (this.props.size === 'large')
        };

        classes[this.props.className] = (this.props.className);

        return classNames(classes);
    }
}

export default Loading;