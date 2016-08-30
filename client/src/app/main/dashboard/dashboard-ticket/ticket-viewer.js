import React from 'react';

import i18n from 'lib-app/i18n';
import TicketAction       from 'app/main/dashboard/dashboard-ticket/ticket-action';
import Form               from 'core-components/form';
import FormField          from 'core-components/form-field';
import SubmitButton       from 'core-components/submit-button';

class TicketViewer extends React.Component {
    static propTypes = {
        ticket: React.PropTypes.object
    };

    static defaultProps = {
        ticket: {
            author: {},
            department: {},
            comments: []
        }
    };

    render() {
        return (
            <div className="ticket-viewer">
                <div className="ticket-viewer__header row">
                    <span className="ticket-viewer__number">#{this.props.ticket.ticketNumber}</span>
                    <span className="ticket-viewer__title">{this.props.ticket.title}</span>
                </div>
                <div className="ticket-viewer__info-row-header row">
                    <div className="ticket-viewer__department col-md-4">{i18n('DEPARTMENT')}</div>
                    <div className="ticket-viewer__author col-md-4">{i18n('AUTHOR')}</div>
                    <div className="ticket-viewer__date col-md-4">{i18n('DATE')}</div>
                </div>
                <div className="ticket-viewer__info-row-values row">
                    <div className="ticket-viewer__department col-md-4">{this.props.ticket.department.name}</div>
                    <div className="ticket-viewer__author col-md-4">{this.props.ticket.author.name}</div>
                    <div className="ticket-viewer__date col-md-4">{this.props.ticket.date}</div>
                </div>
                <div className="ticket-viewer__content">
                    <TicketAction type="comment" config={this.props.ticket} />
                </div>
                <div className="ticket-viewer__comments">
                    {this.props.ticket.comments.map(this.renderComment.bind(this))}
                </div>
                <div className="ticket-viewer__response">
                    <div className="ticket-viewer__response-title row">{i18n('RESPOND')}</div>
                    <div className="ticket-viewer__response-field row">
                        <Form>
                            <FormField name="content" validation="TEXT_AREA" required field="textarea" />
                            <SubmitButton>{i18n('RESPOND_TICKET')}</SubmitButton>
                        </Form>
                    </div>
                </div>
            </div>
        );
    }

    renderComment(comment, index) {
        return (
            <TicketAction type="comment" config={comment} key={index} />
        );
    }
}

export default TicketViewer;