import React from 'react';
import _ from 'lodash';
import {connect}  from 'react-redux';

import i18n  from 'lib-app/i18n';
import API   from 'lib-app/api-call';
import SessionStore       from 'lib-app/session-store';

import TicketEvent        from 'app-components/ticket-event';
import AreYouSure         from 'app-components/are-you-sure';
import DateTransformer    from 'lib-core/date-transformer';
import Form               from 'core-components/form';
import FormField          from 'core-components/form-field';
import SubmitButton       from 'core-components/submit-button';
import DropDown           from 'core-components/drop-down';
import Button             from 'core-components/button';
import Message            from 'core-components/message';
import Icon               from 'core-components/icon';
import TextEditor         from 'core-components/text-editor';

class TicketViewer extends React.Component {
    static propTypes = {
        ticket: React.PropTypes.object,
        onChange: React.PropTypes.func,
        editable: React.PropTypes.bool,
        customResponses: React.PropTypes.array,
        assignmentAllowed: React.PropTypes.bool
    };

    static defaultProps = {
        editable: false,
        ticket: {
            author: {},
            department: {},
            comments: []
        }
    };

    state = {
        loading: false,
        commentValue: TextEditor.createEmpty(),
        commentEdited: false
    };

    render() {
        const ticket = this.props.ticket;

        return (
            <div className="ticket-viewer">
                <div className="ticket-viewer__header row">
                    <span className="ticket-viewer__number">#{ticket.ticketNumber}</span>
                    <span className="ticket-viewer__title">{ticket.title}</span>
                    <span className="ticket-viewer__flag">
                        <Icon name={(ticket.language === 'en') ? 'us' : ticket.language}/>
                    </span>
                </div>
                {this.props.editable ? this.renderEditableHeaders() : this.renderHeaders()}
                <div className="ticket-viewer__content">
                    <TicketEvent type="COMMENT" author={ticket.author} content={ticket.content} date={ticket.date} file={ticket.file}/>
                </div>
                <div className="ticket-viewer__comments">
                    {ticket.events && ticket.events.map(this.renderTicketEvent.bind(this))}
                </div>
                {(!this.props.ticket.closed && (this.props.editable || !this.props.assignmentAllowed)) ? this.renderResponseField() : null}
            </div>
        );
    }

    renderEditableHeaders() {
        const ticket = this.props.ticket;
        const departments = SessionStore.getDepartments();
        const priorities = {
            'low': 0,
            'medium': 1,
            'high': 2
        };
        const priorityList = [
            {content: i18n('LOW')},
            {content: i18n('MEDIUM')},
            {content: i18n('HIGH')}
        ];

        return (
            <div className="ticket-viewer__headers">
                <div className="ticket-viewer__info-row-header row">
                    <div className="col-md-4">{i18n('DEPARTMENT')}</div>
                    <div className=" col-md-4">{i18n('AUTHOR')}</div>
                    <div className="col-md-4">{i18n('DATE')}</div>
                </div>
                <div className="ticket-viewer__info-row-values row">
                    <div className="col-md-4">
                        <DropDown className="ticket-viewer__editable-dropdown"
                                  items={departments.map((department) => {return {content: department.name}})}
                                  selectedIndex={_.findIndex(departments, {id: this.props.ticket.department.id})}
                                  onChange={this.onDepartmentDropdownChanged.bind(this)} />
                    </div>
                    <div className="col-md-4">{ticket.author.name}</div>
                    <div className="col-md-4">{DateTransformer.transformToString(ticket.date)}</div>
                </div>
                <div className="ticket-viewer__info-row-header row">
                    <div className="col-md-4">{i18n('PRIORITY')}</div>
                    <div className="col-md-4">{i18n('OWNER')}</div>
                    <div className="col-md-4">{i18n('STATUS')}</div>
                </div>
                <div className="ticket-viewer__info-row-values row">
                    <div className="col-md-4">
                        <DropDown className="ticket-viewer__editable-dropdown" items={priorityList} selectedIndex={priorities[ticket.priority]} onChange={this.onPriorityDropdownChanged.bind(this)} />
                    </div>
                    <div className="col-md-4">
                        {this.renderEditableOwnerNode()}
                    </div>
                    <div className="col-md-4">
                        {ticket.closed ?
                        <Button type='secondary' size="extra-small" onClick={this.onReopenClick.bind(this)}>
                            {i18n('RE_OPEN')}
                        </Button> : i18n('OPENED')}
                    </div>
                </div>
            </div>
        );
    }

    renderHeaders() {
        const ticket = this.props.ticket;
        const priorities = {
            'low': 'LOW',
            'medium': 'MEDIUM',
            'high': 'HIGH'
        };

        return (
            <div className="ticket-viewer__headers">
                <div className="ticket-viewer__info-row-header row">
                    <div className="ticket-viewer__department col-md-4">{i18n('DEPARTMENT')}</div>
                    <div className="ticket-viewer__author col-md-4">{i18n('AUTHOR')}</div>
                    <div className="ticket-viewer__date col-md-4">{i18n('DATE')}</div>
                </div>
                <div className="ticket-viewer__info-row-values row">
                    <div className="ticket-viewer__department col-md-4">{ticket.department.name}</div>
                    <div className="ticket-viewer__author col-md-4">{ticket.author.name}</div>
                    <div className="ticket-viewer__date col-md-4">{DateTransformer.transformToString(ticket.date, false)}</div>
                </div>
                <div className="ticket-viewer__info-row-header row">
                    <div className="ticket-viewer__department col-md-4">{i18n('PRIORITY')}</div>
                    <div className="ticket-viewer__author col-md-4">{i18n('OWNER')}</div>
                    <div className="ticket-viewer__date col-md-4">{i18n('STATUS')}</div>
                </div>
                <div className="ticket-viewer__info-row-values row">
                    <div className="col-md-4">
                        {i18n(priorities[this.props.ticket.priority || 'low'])}
                    </div>
                    <div className="col-md-4">
                        {this.renderOwnerNode()}
                    </div>
                    <div className="col-md-4">
                        {i18n((this.props.ticket.closed) ? 'CLOSED' : 'OPENED')}
                    </div>
                </div>
            </div>
        );
    }

    renderEditableOwnerNode() {
        let ownerNode = null;
        let {ticket, userId} = this.props;

        if (_.isEmpty(ticket.owner) || ticket.owner.id == userId) {
            ownerNode = (
                <Button type={(ticket.owner) ? 'primary' : 'secondary'} size="extra-small" onClick={this.onAssignClick.bind(this)}>
                    {i18n(ticket.owner ? 'UN_ASSIGN' : 'ASSIGN_TO_ME')}
                </Button>
            );
        } else {
            ownerNode = (this.props.ticket.owner) ? this.props.ticket.owner.name : i18n('NONE')
        }

        return ownerNode;
    }

    renderOwnerNode() {
        let ownerNode = null;

        if (this.props.assignmentAllowed && _.isEmpty(this.props.ticket.owner)) {
            ownerNode = (
                <Button type="secondary" size="extra-small" onClick={this.onAssignClick.bind(this)}>
                    {i18n('ASSIGN_TO_ME')}
                </Button>
            );
        } else {
            ownerNode = (this.props.ticket.owner) ? this.props.ticket.owner.name : i18n('NONE')
        }

        return ownerNode;
    }

    renderTicketEvent(options, index) {
        return (
            <TicketEvent {...options} author={(!_.isEmpty(options.author)) ? options.author : this.props.ticket.author} key={index} />
        );
    }

    renderResponseField() {
        return (
            <div className="ticket-viewer__response">
                <div className="ticket-viewer__response-title row">{i18n('RESPOND')}</div>
                {this.renderCustomResponses()}
                <div className="ticket-viewer__response-field row">
                    <Form {...this.getCommentFormProps()}>
                        <FormField name="content" validation="TEXT_AREA" required field="textarea" />
                        {(this.props.allowAttachments) ? <FormField name="file" field="file"/> : null}
                        <div className="ticket-viewer__response-buttons">
                            <SubmitButton type="secondary">{i18n('RESPOND_TICKET')}</SubmitButton>
                            <Button size="medium" onClick={this.onCloseTicketClick.bind(this)}>{i18n('CLOSE_TICKET')}</Button>
                        </div>
                    </Form>
                </div>
                {(this.state.commentError) ? this.renderCommentError() : null}
            </div>
        );
    }

    renderCustomResponses() {
        let customResponsesNode = null;

        if (this.props.customResponses && this.props.editable) {
            let customResponses = this.props.customResponses.map((customResponse) => {
                return {
                    content: customResponse.name
                };
            });

            customResponses.unshift({
                content: i18n('SELECT_CUSTOM_RESPONSE')
            });

            customResponsesNode = (
                <div className="ticket-viewer__response-custom row">
                    <DropDown items={customResponses} size="medium" onChange={this.onCustomResponsesChanged.bind(this)}/>
                </div>
            );
        }

        return customResponsesNode;
    }

    renderCommentError() {
        return (
            <Message className="ticket-viewer__message" type="error">{i18n('TICKET_COMMENT_ERROR')}</Message>
        );
    }

    getCommentFormProps() {
        return {
            onSubmit: this.onSubmit.bind(this),
            loading: this.state.loading,
            onChange: (formState) => {this.setState({
                commentValue: formState.content,
                commentFile: formState.file,
                commentEdited: true
            })},
            values: {
                'content': this.state.commentValue,
                'file': this.state.commentFile
            }
        };
    }

    onDepartmentDropdownChanged(event) {
        AreYouSure.openModal(null, this.changeDepartment.bind(this, event.index));
    }

    onPriorityDropdownChanged(event) {
        AreYouSure.openModal(null, this.changePriority.bind(this, event.index));
    }

    onAssignClick() {
        API.call({
            path: (this.props.ticket.owner) ? '/staff/un-assign-ticket' : '/staff/assign-ticket',
            data: {
                ticketNumber: this.props.ticket.ticketNumber
            }
        }).then(this.onTicketModification.bind(this));
    }

    onReopenClick() {
        AreYouSure.openModal(null, this.reopenTicket.bind(this));
    }

    onCloseTicketClick(event) {
        event.preventDefault();
        AreYouSure.openModal(null, this.closeTicket.bind(this));
    }

    reopenTicket() {
        API.call({
            path: '/ticket/re-open',
            data: {
                ticketNumber: this.props.ticket.ticketNumber
            }
        }).then(this.onTicketModification.bind(this));
    }

    closeTicket() {
        API.call({
            path: '/ticket/close',
            data: {
                ticketNumber: this.props.ticket.ticketNumber
            }
        }).then(this.onTicketModification.bind(this));
    }

    changeDepartment(index) {
        API.call({
            path: '/ticket/change-department',
            data: {
                ticketNumber: this.props.ticket.ticketNumber,
                departmentId: SessionStore.getDepartments()[index].id
            }
        }).then(this.onTicketModification.bind(this));
    }

    changePriority(index) {
        const priorities = [
            'low',
            'medium',
            'high'
        ];

        API.call({
            path: '/ticket/change-priority',
            data: {
                ticketNumber: this.props.ticket.ticketNumber,
                priority: priorities[index]
            }
        }).then(this.onTicketModification.bind(this));
    }

    onCustomResponsesChanged({index}) {
        let replaceContentWithCustomResponse = () => {
            this.setState({
                commentValue: TextEditor.getEditorStateFromHTML(this.props.customResponses[index-1].content || ''),
                commentEdited: false
            });
        };

        if (this.state.commentEdited && index) {
            AreYouSure.openModal(null, replaceContentWithCustomResponse);
        } else {
            replaceContentWithCustomResponse();
        }
    }

    onSubmit(formState) {
        this.setState({
            loading: true
        });

        API.call({
            path: '/ticket/comment',
            dataAsForm: true,
            data: _.extend({
                ticketNumber: this.props.ticket.ticketNumber
            }, formState)
        }).then(this.onCommentSuccess.bind(this), this.onCommentFail.bind(this));
    }

    onCommentSuccess() {
        this.setState({
            loading: false,
            commentValue: TextEditor.createEmpty(),
            commentError: false,
            commentEdited: false
        });

        this.onTicketModification();
    }

    onCommentFail() {
        this.setState({
            loading: false,
            commentError: true
        });
    }

    onTicketModification() {
        if (this.props.onChange) {
            this.props.onChange();
        }
    }
}

export default connect((store) => {
    return {
        userId: store.session.userId,
        allowAttachments: store.config['allow-attachments'],
        userSystemEnabled: store.config['user-system-enabled']
    };
})(TicketViewer);
