import React from 'react';
import _ from 'lodash';
import htmlToText from 'html-to-text';

import i18n from 'lib-app/i18n';
import Icon from 'core-components/icon';

class TicketInfo extends React.Component {
    static propTypes = {
        ticket: React.PropTypes.object
    };

    render() {
        return (
            <div className="ticket-info">
                <div className="ticket-info__title">
                    {this.props.ticket.title}
                    <span className="ticket-info__flag">
                        <Icon name={(this.props.ticket.language === 'en') ? 'us' : this.props.ticket.language}/>
                    </span>
                </div>
                <div className="ticket-info__description">
                    {htmlToText.fromString(this.props.ticket.content)}
                </div>

                <div className="ticket-info__author">
                    {i18n('AUTHOR')}: {this.props.ticket.author.name}
                </div>
                <div className="ticket-info__properties">
                    <div className="ticket-info__properties__status">
                        <span className="ticket-info__properties__label">
                            {i18n('STATUS')}:
                        </span>
                        <span className={this.getStatusClass()}>
                            {(this.props.ticket.closed) ? 'closed' : 'open'}
                        </span>
                    </div>
                    <div className="ticket-info__properties__owner">
                        <span className="ticket-info__properties__label">
                            {i18n('OWNED')}:
                        </span>
                        <span className={this.getOwnedClass()}>
                            {(this.props.ticket.owner) ?  i18n('YES') :  i18n('NO')}
                        </span>
                    </div>
                    <div className="ticket-info__properties__comments">
                        <span className="ticket-info__properties__label">
                            {i18n('COMMENTS')}:
                        </span>
                        <span className="ticket-info__properties__badge-blue">
                            {_.filter(this.props.ticket.events, event => event.type === 'COMMENT').length}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    getStatusClass() {
        if(this.props.ticket.closed) {
            return 'ticket-info__properties__badge-red';
        } else {
            return 'ticket-info__properties__badge-green';
        }
    }

    getOwnedClass() {
        if(this.props.ticket.owner) {
            return 'ticket-info__properties__badge-green';
        } else {
            return 'ticket-info__properties__badge-red';
        }
    }

}

export default TicketInfo;
