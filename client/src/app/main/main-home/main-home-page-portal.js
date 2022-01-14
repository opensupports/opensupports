import React from 'react';
import classNames from 'classnames';
import {connect} from 'react-redux'

import history from 'lib-app/history';
import Widget from 'core-components/widget';
import Card from 'core-components/card';
import i18n from 'lib-app/i18n';
import Header from 'core-components/header';
import queryString from 'query-string';
import Message from 'core-components/message';

class MainHomePagePortal extends React.Component {
    static propTypes = {
        type: React.PropTypes.oneOf(['default', 'complete'])
    };

    state = {
        showMessage: !!queryString.parse(window.location.search)["message"]
    };

    render() {
        return (
            <div className="main-home-page-portal__message">
                <Message
                    showMessage={this.state.showMessage}
                    onCloseMessage={this.onCloseMessage.bind(this)}
                    className="dashboard-create-ticket-page__message"
                    type="success">
                        {i18n('TICKET_NUMBER_SENT')}
                </Message>
                <Widget className={classNames('main-home-page-portal', this.props.className)}>
                    <div className="main-home-page-portal__title">
                        <Header title={this.props.title || i18n('SUPPORT_CENTER')} description={i18n('SUPPORT_CENTER_DESCRIPTION')} />
                    </div>
                    <div className="main-home-page-portal__cards">
                        <div className="main-home-page-portal__card col-md-4">
                            <Card {...this.getTicketsCardProps()}/>
                        </div>
                        <div className="main-home-page-portal__card col-md-4">
                            <Card {...((this.props.type === 'complete') ? this.getViewTicketCardProps() : this.getAccountCardProps())} />
                        </div>
                        <div className="main-home-page-portal__card col-md-4">
                            <Card {...this.getArticlesCardProps()} />
                        </div>
                    </div>
                </Widget>
            </div>
        );
    }

    getTicketsCardProps() {
        return {
            title: i18n('TICKETS'),
            description: i18n('TICKETS_DESCRIPTION'),
            icon: 'ticket',
            color: 'red',
            buttonText: (this.props.type === 'complete') ? i18n('CREATE_TICKET') : null,
            onButtonClick: () => history.push('/create-ticket')
        };
    }

    getAccountCardProps() {
        return {
            title: i18n('ACCOUNT'),
            description: i18n('ACCOUNT_DESCRIPTION'),
            icon: 'user',
            color: 'green'
        };
    }

    getArticlesCardProps() {
        return {
            title: i18n('ARTICLES'),
            description: i18n('ARTICLES_DESCRIPTION'),
            icon: 'book',
            color: 'blue',
            buttonText: (this.props.type === 'complete') ? i18n('VIEW_ARTICLES') : null,
            onButtonClick: () => history.push('/articles')
        };
    }

    getViewTicketCardProps() {
        return {
            title: i18n('VIEW_TICKET'),
            description: i18n('VIEW_TICKET_DESCRIPTION'),
            icon: 'check-square-o',
            color: 'green',
            buttonText: (this.props.type === 'complete') ? i18n('CHECK_TICKET') : null,
            onButtonClick: () => history.push('/check-ticket')
        };
    }

    onCloseMessage() {
        this.setState({
            showMessage: false
        });
    }
}

export default connect((store) => {
    return {
        title: store.config.title
    };
})(MainHomePagePortal);