import React from 'react';
import _ from 'lodash';
import {connect}  from 'react-redux';

import AdminDataActions from 'actions/admin-data-actions';

import i18n  from 'lib-app/i18n';
import API   from 'lib-app/api-call';
import SessionStore       from 'lib-app/session-store';
import MentionsParser     from 'lib-app/mentions-parser';
import history from 'lib-app/history';

import TicketEvent        from 'app-components/ticket-event';
import AreYouSure         from 'app-components/are-you-sure';
import Form               from 'core-components/form';
import FormField          from 'core-components/form-field';
import SubmitButton       from 'core-components/submit-button';
import DropDown           from 'core-components/drop-down';
import Button             from 'core-components/button';
import Message            from 'core-components/message';
import Icon               from 'core-components/icon';
import TextEditor         from 'core-components/text-editor';
import InfoTooltip        from 'core-components/info-tooltip';
import DepartmentDropdown from 'app-components/department-dropdown';
import TagSelector        from 'core-components/tag-selector';
import Tag                from 'core-components/tag';

class TicketViewer extends React.Component {
    static propTypes = {
        ticket: React.PropTypes.object,
        onChange: React.PropTypes.func,
        editable: React.PropTypes.bool,
        customResponses: React.PropTypes.array,
        assignmentAllowed: React.PropTypes.bool,
        staffMembers: React.PropTypes.array,
        staffMembersLoaded: React.PropTypes.bool,
        allowAttachments: React.PropTypes.bool,
        userId: React.PropTypes.number,
        userStaff: React.PropTypes.bool,
        userDepartments: React.PropTypes.array,
        userLevel: React.PropTypes.number,
        tags: React.PropTypes.array
    };

    static defaultProps = {
        tags: [],
        editable: false,
        ticket: {
            author: {},
            department: {},
            comments: [],
            edited: null
        }
    };

    state = {
        loading: false,
        commentValue: TextEditor.createEmpty(),
        commentEdited: false,
        commentPrivate: false,
        edit: false,
        editId: 0,
        tagSelectorLoading: false,
        editTitle: false,
        newTitle: this.props.ticket.title,
        editTitleError: false,
    };

    componentDidMount() {
        if(!this.props.staffMembersLoaded && this.props.userStaff) {
            this.props.dispatch(AdminDataActions.retrieveStaffMembers());
        }
    }

    render() {
        const ticket = this.props.ticket;
        return (
            <div className="ticket-viewer">
                {this.state.editTitle ? this.renderEditableTitle() : this.renderTitleHeader()}
                {this.props.editable ? this.renderEditableHeaders() : this.renderHeaders()}
                <div className="ticket-viewer__content">
                    <TicketEvent
                        loading={this.state.loading}
                        type="COMMENT"
                        author={ticket.author}
                        content={this.props.userStaff ? MentionsParser.parse(ticket.content) : ticket.content}
                        userStaff={this.props.userStaff}
                        userId={this.props.userId}
                        date={ticket.date}
                        onEdit={this.onEdit.bind(this,0)}
                        edited={ticket.edited}
                        file={ticket.file}
                        edit={this.state.edit && this.state.editId == 0}
                        onToggleEdit={this.onToggleEdit.bind(this, 0)}
                        allowAttachments={this.props.allowAttachments}
                    />
                </div>
                <div className="ticket-viewer__comments">
                    {ticket.events && ticket.events.map(this.renderTicketEvent.bind(this))}
                </div>
                {(!this.props.ticket.closed && (this.props.editable || !this.props.assignmentAllowed)) ? this.renderResponseField() : (this.showDeleteButton())? <Button size="medium" onClick={this.onDeleteTicketClick.bind(this)}>{i18n('DELETE_TICKET')}</Button> : null}
            </div>
        );
    }

    renderTitleHeader() {
        const {ticket, userStaff, userId} = this.props;
        const {ticketNumber, title, author, editedTitle, language} = ticket;

        return(
            <div className="ticket-viewer__header">
                <span className="ticket-viewer__number">#{ticketNumber}</span>
                <span className="ticket-viewer__title">{title}</span>
                <span className="ticket-viewer__flag">
                    <Icon name={(language === 'en') ? 'us' : language}/>
                </span>
                {((author.id == userId && author.staff == userStaff) || userStaff) ? this.renderEditTitleOption() : null}
                {editedTitle ? this.renderEditedTitleText() : null }
            </div>
        )
    }

    renderEditedTitleText(){
        return(
            <div className="ticket-viewer__edited-title-text"> {i18n('TITLE_EDITED')} </div>
        )
    }
    
    renderEditTitleOption() {
        return(
            <span className="ticket-viewer__edit-title-icon">
                <Icon name="pencil" onClick={() => this.setState({editTitle: true})} />
            </span>
        )
    }

    renderEditableTitle(){
        return(
            <div className="ticket-viewer__header">
                <div className="ticket-viewer__edit-title-box">
                    <FormField className="ticket-viewer___input-edit-title" error={this.state.editTitleError}  value={this.state.newTitle} field='input' onChange={(e) => this.setState({newTitle: e.target.value })} />
                </div>
                <Button type='secondary' size="extra-small" onClick={this.changeTitle.bind(this)}>
                    {i18n('EDIT_TITLE')}
                </Button>
            </div>
        )
    }

    renderEditableHeaders() {
        const ticket = this.props.ticket;
        const departments = this.getDepartmentsForTransfer();

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
                <div className="ticket-viewer__info">
                    <div className="ticket-viewer__info-container-editable">
                        <div className="ticket-viewer__info-header">{i18n('DEPARTMENT')}</div>
                        <div className="ticket-viewer__info-value">
                            <DepartmentDropdown className="ticket-viewer__editable-dropdown"
                                    departments={departments}
                                    selectedIndex={_.findIndex(departments, {id: this.props.ticket.department.id})}
                                    onChange={this.onDepartmentDropdownChanged.bind(this)} />
                        </div>
                    </div>
                    <div className="ticket-viewer__info-container-editable">
                        <div className="ticket-viewer__info-header">{i18n('AUTHOR')}</div>
                        <div className="ticket-viewer__info-value">{ticket.author.name}</div>
                    </div>
                    <div className="ticket-viewer__info-container-editable">
                        <div className="ticket-viewer__info-header">{i18n('TAGS')}</div>
                        <div className="ticket-viewer__info-value">
                            <TagSelector
                                items={this.props.tags}
                                values={this.props.ticket.tags}
                                onRemoveClick={this.removeTag.bind(this)}
                                onTagSelected={this.addTag.bind(this)}
                                loading={this.state.tagSelectorLoading}/>
                        </div>
                    </div>
                </div>

                <div className="ticket-viewer__info">
                    <div className="ticket-viewer__info-container-editable">
                        <div className="ticket-viewer__info-header">{i18n('PRIORITY')}</div>
                        <div className="ticket-viewer__info-value">
                            <DropDown
                                className="ticket-viewer__editable-dropdown"
                                items={priorityList}
                                selectedIndex={priorities[ticket.priority]}
                                onChange={this.onPriorityDropdownChanged.bind(this)} />
                        </div>
                    </div>
                    <div className="ticket-viewer__info-container-editable">
                        <div className="ticket-viewer__info-header">{i18n('OWNER')}</div>
                        <div className="ticket-viewer__info-value">
                            {this.renderAssignStaffList()}
                        </div>
                    </div>
                    <div className="ticket-viewer__info-container-editable">
                        <div className="ticket-viewer__info-header">{i18n('STATUS')}</div>
                            <div className="ticket-viewer__info-value">
                            {ticket.closed ?
                            <Button type='secondary' size="extra-small" onClick={this.onReopenClick.bind(this)}>
                                {i18n('RE_OPEN')}
                            </Button> : i18n('OPENED')}
                        </div>
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
                <div className="ticket-viewer__info">
                    <div className="ticket-viewer__info-container">
                        <div className="ticket-viewer__info-header">{i18n('DEPARTMENT')}</div>
                        <div className="ticket-viewer__info-value">{ticket.department.name}</div>
                    </div>
                        <div className="ticket-viewer__info-container">
                            <div className="ticket-viewer__info-header">{i18n('AUTHOR')}</div>
                            <div className="ticket-viewer__info-value">{ticket.author.name}</div>
                    </div>
                    <div className="ticket-viewer__info-container">
                        <div className="ticket-viewer__info-header">{i18n('TAGS')}</div>
                        <div className="ticket-viewer__info-value">{ticket.tags.length ? ticket.tags.map((tagName,index) => {
                            let tag = _.find(this.props.tags, {name:tagName});
                            return <Tag name={tag && tag.name} color={tag && tag.color} key={index} />
                        }) : i18n('NONE')}</div>
                    </div>
                </div>
                <div className="ticket-viewer__info">
                    <div className="ticket-viewer__info-container">
                        <div className="ticket-viewer__info-header">{i18n('PRIORITY')}</div>
                        <div className="ticket-viewer__info-value">
                            {i18n(priorities[this.props.ticket.priority || 'low'])}
                        </div>
                    </div>
                    <div className="ticket-viewer__info-container">
                        <div className="ticket-viewer__info-header">{i18n('OWNER')}</div>
                        <div className="ticket-viewer__info-value">
                            {this.renderOwnerNode()}
                        </div>
                    </div>
                    <div className="ticket-viewer__info-container">
                        <div className="ticket-viewer__info-header">{i18n('STATUS')}</div>
                        <div className="ticket-viewer__info-value">
                            {i18n((this.props.ticket.closed) ? 'CLOSED' : 'OPENED')}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    renderOwnerNode() {
        let ownerNode = null;

        if (this.props.assignmentAllowed) {
            ownerNode = this.renderAssignStaffList();
        } else {
            ownerNode = (this.props.ticket.owner) ? this.props.ticket.owner.name : i18n('NONE')
        }

        return ownerNode;
    }

    renderAssignStaffList() {
        const items = this.getStaffAssignmentItems();
        const ownerId = this.props.ticket.owner && this.props.ticket.owner.id;

        let selectedIndex = _.findIndex(items, {id: ownerId});
        selectedIndex = (selectedIndex !== -1) ? selectedIndex : 0;

        return (
            <DropDown
                className="ticket-viewer__editable-dropdown" items={items}
                selectedIndex={selectedIndex}
                onChange={this.onAssignmentChange.bind(this)}
                />
        );
    }

    renderTicketEvent(options, index) {
        if (this.props.userStaff && typeof options.content === 'string') {
            options.content = MentionsParser.parse(options.content);
        }
        return (
            <TicketEvent
                {...options}
                author={(!_.isEmpty(options.author)) ? options.author : this.props.ticket.author}
                userStaff={this.props.userStaff}
                userId={this.props.userId}
                onEdit={this.onEdit.bind(this, options.id)}
                edit={this.state.edit && this.state.editId == options.id}
                onToggleEdit={this.onToggleEdit.bind(this, options.id)}
                key={index}
                allowAttachments={this.props.allowAttachments}
            />
        );
    }

    renderResponseField() {
        return (
            <div className="ticket-viewer__response">
                <Form {...this.getCommentFormProps()}>
                    <div className="ticket-viewer__response-title row">{i18n('RESPOND')}</div>
                    <div className="row">
                        <div className="ticket-viewer__response-actions">
                            {this.renderCustomResponses()}
                            {this.renderPrivate()}
                        </div>
                    </div>
                    <div className="ticket-viewer__response-field row">
                        <FormField name="content" validation="TEXT_AREA" required field="textarea" fieldProps={{allowImages: this.props.allowAttachments}}/>
                        {(this.props.allowAttachments) ? <FormField name="file" field="file"/> : null}
                        <div className="ticket-viewer__response-buttons">
                            <SubmitButton type="secondary">{i18n('RESPOND_TICKET')}</SubmitButton>
                            <div>
                                <Button size="medium" onClick={this.onCloseTicketClick.bind(this)}>{i18n('CLOSE_TICKET')}</Button>
                                {(this.showDeleteButton())? <Button className="ticket-viewer__delete-button" size="medium" onClick={this.onDeleteTicketClick.bind(this)}>{i18n('DELETE_TICKET')}</Button> : null}
                            </div>
                        </div>
                    </div>
                    {(this.state.commentError) ? this.renderCommentError() : null}
                </Form>
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
                <div className="ticket-viewer__response-custom">
                    <DropDown items={customResponses} size="medium" onChange={this.onCustomResponsesChanged.bind(this)}/>
                </div>
            );
        }

        return customResponsesNode;
    }

    renderPrivate() {
        if (this.props.userStaff) {
            return (
                <div className="ticket-viewer__response-private">
                    <FormField label={i18n('PRIVATE')} name="private" field="checkbox"/>
                    <InfoTooltip className="ticket-viewer__response-private-info" text={i18n('PRIVATE_RESPONSE_DESCRIPTION')} />
                </div>
            );
        } else {
            return null;
        }
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
                commentEdited: true,
                commentPrivate: formState.private
            })},
            values: {
                'content': this.state.commentValue,
                'file': this.state.commentFile,
                'private': this.state.commentPrivate
            }
        };
    }

    getPublicDepartments() {
        return _.filter(SessionStore.getDepartments(),d => !(d.private*1));
    }

    onDepartmentDropdownChanged(event) {
        AreYouSure.openModal(null, this.changeDepartment.bind(this, event.index));
    }

    onPriorityDropdownChanged(event) {
        AreYouSure.openModal(null, this.changePriority.bind(this, event.index));
    }

    onAssignmentChange(event) {
        AreYouSure.openModal(null, this.assingTo.bind(this, event.index));
    }

    assingTo(index) {
        const id = this.getStaffAssignmentItems()[index].id;
        const {ticketNumber, owner} = this.props.ticket;

        let APICallPromise = new Promise(resolve => resolve());

        if(owner) {
            APICallPromise.then(() => API.call({
                path: '/staff/un-assign-ticket',
                data: { ticketNumber }
            }));
        }

        if(id !== 0) {
            APICallPromise.then(() => API.call({
                path: '/staff/assign-ticket',
                data: { ticketNumber, staffId: id }
            }));
        }

        return APICallPromise.then(this.onTicketModification.bind(this));
    }

    onReopenClick() {
        AreYouSure.openModal(null, this.reopenTicket.bind(this));
    }

    onCloseTicketClick(event) {
        event.preventDefault();
        AreYouSure.openModal(null, this.closeTicket.bind(this));
    }

    onDeleteTicketClick(event) {
        event.preventDefault();
        AreYouSure.openModal(null, this.deleteTicket.bind(this));
    }

    changeTitle(){
        API.call({
            path: '/ticket/edit-title',
            data: {
                ticketNumber: this.props.ticket.ticketNumber,
                title: this.state.newTitle
            }
        }).then(() => {
            this.setState({
                editTitle: false,
                editTitleError: false
            });
            this.onTicketModification();
        }).catch((result) => {
            this.setState({
                editTitleError: i18n(result.message)
            })
        });
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

    deleteTicket() {
        API.call({
            path: '/ticket/delete',
            data: {
                ticketNumber: this.props.ticket.ticketNumber
            }
        }).then((result) => {
             this.onTicketModification(result);
             history.push('/admin/panel/tickets/my-tickets/');
        });
    }

    changeDepartment(index) {
        API.call({
            path: '/ticket/change-department',
            data: {
                ticketNumber: this.props.ticket.ticketNumber,
                departmentId: this.getDepartmentsForTransfer()[index].id
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

    addTag(tag) {
        this.setState({
            tagSelectorLoading: true,
        })
        API.call({
            path: '/ticket/add-tag',
            data: {
                ticketNumber: this.props.ticket.ticketNumber,
                tagId: tag
            }
        })
        .then(() => {
            this.setState({
                tagSelectorLoading: false,
            });
            this.onTicketModification();
        })
        .catch(() => this.setState({
            tagSelectorLoading: false,
        }))
    }

    removeTag(tag) {
        this.setState({
            tagSelectorLoading: true,
        });

        API.call({
            path: '/ticket/remove-tag',
            data: {
                ticketNumber: this.props.ticket.ticketNumber,
                tagId: tag
            }
        }).then(() => {
            this.setState({
                tagSelectorLoading: false,
            });

            this.onTicketModification();
        }).catch(() => this.setState({
            tagSelectorLoading: false,
        }))
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

    onToggleEdit(ticketEventId){
        this.setState({
            edit: !this.state.edit,
            editId: ticketEventId
        })
    }

    onEdit(ticketeventid,{content}) {
        this.setState({
            loading: true
        });
        const data = {};

        if(ticketeventid){
            data.ticketEventId = ticketeventid
        }else{
            data.ticketNumber = this.props.ticket.ticketNumber
        }

        API.call({
            path: '/ticket/edit-comment',
            data: _.extend(
                data,
                TextEditor.getContentFormData(content)
            )
        }).then(this.onEditCommentSuccess.bind(this), this.onFailCommentFail.bind(this));
    }

    onEditCommentSuccess() {
        this.setState({
            loading: false,
            commentError: false,
            commentEdited: false,
            edit:false
        });

        this.onTicketModification();
    }

    onFailCommentFail() {
        this.setState({
            loading: false,
            commentError: true
        });
    }

    onSubmit(formState) {
        this.setState({
            loading: true
        });

        API.call({
            path: '/ticket/comment',
            dataAsForm: true,
            data: _.extend({
                ticketNumber: this.props.ticket.ticketNumber,
            }, formState, {private: formState.private ? 1 : 0}, TextEditor.getContentFormData(formState.content))
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

    getStaffAssignmentItems() {
        const {staffMembers, userDepartments, userId, ticket} = this.props;
        const ticketDepartmentId = ticket.department.id;
        let staffAssignmentItems = [
            {content: 'None', id: 0}
        ];

        if(_.some(userDepartments, {id: ticketDepartmentId})) {
            staffAssignmentItems.push({content: i18n('ASSIGN_TO_ME'), id: userId});
        }

        staffAssignmentItems = staffAssignmentItems.concat(
            _.map(
                _.filter(staffMembers, ({id, departments}) => {
                    return (id != userId) && _.some(departments, {id: ticketDepartmentId});
                }),
                ({id, name}) => ({content: name, id})
            )
        );

        return staffAssignmentItems;
    }

    getDepartmentsForTransfer() {
        return this.props.ticket.author.staff ? SessionStore.getDepartments() : this.getPublicDepartments();
    }

    showDeleteButton() {
        if(!this.props.ticket.owner) {
            if(this.props.userLevel == 3) return true;
            if(this.props.userId == this.props.ticket.author.id) {
                if((this.props.userStaff && this.props.ticket.author.staff) || (!this.props.userStaff && !this.props.ticket.author.staff)){
                    return true;
                }
            }
        }
        return false;
    }
}

export default connect((store) => {
    return {
        userId: store.session.userId,
        userStaff: store.session.staff,
        userDepartments: store.session.userDepartments,
        staffMembers: store.adminData.staffMembers,
        staffMembersLoaded: store.adminData.staffMembersLoaded,
        allowAttachments: store.config['allow-attachments'],
        userLevel: store.session.userLevel,
        tags: store.config['tags']
    };
})(TicketViewer);
