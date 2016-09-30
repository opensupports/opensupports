import React from 'react';
import i18n from 'lib-app/i18n';

class TicketInfo extends React.Component {
    static propTypes = {
        ticket: React.PropTypes.object
    };

    render() {
        return (
            <div className="ticket-info">
                <div className="ticket-info__title">
                    {this.props.ticket.title}
                </div>
                <div className="ticket-info__description">
                    {this.props.ticket.content}
                </div>
                <div className="ticket-info__author">
                    Author: {this.props.ticket.author.name}
                </div>
                <div className="ticket-info__properties">
                    <div className="ticket-info__properties__status">
                        <span className="ticket-info__properties__label">
                            Status:
                        </span>
                        <span className={this.getStatusClass()}>
                            {(this.props.ticket.closed) ? 'closed' : 'open'}
                        </span>
                    </div>
                    <div className="ticket-info__properties__priority">
                        <span className="ticket-info__properties__label">
                            Priority:
                        </span>
                        <span className={this.getPriorityClass()}>
                            {this.props.ticket.priority}
                        </span>
                    </div>
                    <div className="ticket-info__properties__owner">
                        <span className="ticket-info__properties__label">
                            Owned:
                        </span>
                        <span className="ticket-info__properties__badge-red">
                            none
                        </span>
                    </div>
                    <div className="ticket-info__properties__comments">
                        <span className="ticket-info__properties__label">
                            Comments:
                        </span>
                        <span className="ticket-info__properties__badge-blue">
                            21
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

    getPriorityClass() {
        let priorityClasses = {
            'low': 'ticket-info__properties__badge-green',
            'medium': 'ticket-info__properties__badge-blue',
            'high': 'ticket-info__properties__badge-red'
        };

        return priorityClasses[this.props.ticket.priority];
    }
}

export default TicketInfo;