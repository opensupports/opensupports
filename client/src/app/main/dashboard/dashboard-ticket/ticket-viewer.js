import React from 'react';
import _ from 'lodash';

import i18n  from 'lib-app/i18n';
import API   from 'lib-app/api-call';
import store from 'app/store';
import SessionActions     from 'actions/session-actions';

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

    constructor(props) {
        super(props);

        this.state = {
            loading: false
        };
    }


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
                        <Form onSubmit={this.onSubmit.bind(this)} loading={this.state.loading}>
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

    onSubmit(formState) {
        this.setState({
            loading: true
        });

        API.call({
            path: '/ticket/comment',
            data: _.extend({
                ticketNumber: this.props.ticket.ticketNumber
            }, formState)
        }).then(this.onCommentSuccess.bind(this), this.onCommentFail.bind(this));
    }

    onCommentSuccess() {
        this.setState({
            loading: false
        });

        store.dispatch(SessionActions.getUserData());
    }

    onCommentFail() {
        this.setState({
            loading: false
        });
    }
}

export default TicketViewer;