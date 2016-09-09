import React from 'react';
import classNames from 'classnames';

import Widget from 'core-components/widget';
import Card from 'core-components/card';
import i18n from 'lib-app/i18n';
import Header from 'core-components/header';

class MainHomePagePortal extends React.Component {
    render() {
        return (
            <Widget className={classNames('main-home-page-portal', this.props.className)}>
                <div className="main-home-page-portal__title">
                    <Header title={i18n('SUPPORT_CENTER')} description={i18n('SUPPORT_CENTER_DESCRIPTION')} />
                </div>
                <div className="main-home-page-portal__cards">
                    <div className="main-home-page-portal__card col-md-4">
                        <Card title={i18n('TICKETS')} description={i18n('TICKETS_DESCRIPTION')} icon="ticket" color="red"/>
                    </div>
                    <div className="main-home-page-portal__card col-md-4">
                        <Card title={i18n('ARTICLES')} description={i18n('ARTICLES_DESCRIPTION')} icon="book" color="blue"/>
                    </div>
                    <div className="main-home-page-portal__card col-md-4">
                        <Card title={i18n('ACCOUNT')} description={i18n('ACCOUNT_DESCRIPTION')} icon="user" color="green"/>
                    </div>
                </div>
            </Widget>
        );
    }
}

export default MainHomePagePortal;