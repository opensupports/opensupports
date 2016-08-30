import React from 'react';
import classNames from 'classnames';


import Widget from 'core-components/widget';
import Card from 'core-components/card';
import i18n from 'lib-app/i18n';

class MainHomePagePortal extends React.Component {
    render() {
        return (
            <Widget className={classNames('main-home-page-portal', this.props.className)}>
                <Card title={i18n('TICKETS')} description={i18n('TICKETS_DESCRIPTION')} icon="ticket" color="red"/>
                <Card title={i18n('ARTICLES')} description={i18n('ARTICLES_DESCRIPTION')} icon="book" color="blue"/>
                <Card title={i18n('ACCOUNT')} description={i18n('ACCOUNT_DESCRIPTION')} icon="user" color="green"/>
            </Widget>
        );

    }
}

export default MainHomePagePortal;