import React from 'react';
import classNames from 'classnames';

import Widget from 'core-components/widget';

class MainHomePagePortal extends React.Component {
    render() {
        return (
            <Widget className={classNames('main-home-page-portal', this.props.className)}>
                support portal
            </Widget>
        );
    }
}

export default MainHomePagePortal;