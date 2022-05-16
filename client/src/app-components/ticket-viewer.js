import React from 'react';
import _ from 'lodash';
import {connect}  from 'react-redux';

import AdminDataActions from 'actions/admin-data-actions';

import i18n  from 'lib-app/i18n';
import API   from 'lib-app/api-call';
import SessionStore       from 'lib-app/session-store';
import MentionsParser     from 'lib-app/mentions-parser';
import history from 'lib-app/history';
import searchTicketsUtils from 'lib-app/search-tickets-utils';
import ticketUtils from 'lib-app/ticket-utils';

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
import Loading from 'core-components/loading';

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
        editTitleLoading: false,
        editStatus: false,
        editTags: false,
        editOwner: false,
        editDepartment: false,
        showTicketCommentErrorMessage: true
    };

    componentDidMount() {
        const { staffMembersLoaded, userStaff, dispatch } = this.props;

        if(!staffMembersLoaded && userStaff) {
            dispatch(AdminDataActions.retrieveStaffMembers());
        }
    }

    render() {
        const { ticket, userStaff, userId, editable, allowAttachments, assignmentAllowed } = this.props;
        const { editTitle, loading, edit, editId } = this.state;
        const { closed, author, content, date, edited, file, events} = ticket;
        const showResponseField = (!closed && (editable || !assignmentAllowed));
        const lastComment = events.map(
            (event, index) => {
                return  {...event, index}}
        ).filter(
            (event) => event.type === "COMMENT"
        ).at(-1);

        const eventsWithModifiedComments = events.map(
            (event, index) => {
                return {...event, isLastComment: lastComment && index === lastComment.index && event.type === "COMMENT"};
            }
        );

        return (
            <div className="ticket-viewer">
                {editTitle ? this.renderEditableTitle() : this.renderTitleHeader()}
                {editable ? this.renderEditableHeaders() : this.renderHeaders()}
                <div className="ticket-viewer__content">
                    <TicketEvent
                        loading={loading}
                        type="COMMENT"
                        isLastComment={!events.filter(event => event.type === "COMMENT").length}
                        author={author}
                        isTicketClosed={closed}
                        content={userStaff ? MentionsParser.parse(content) : content}
                        userStaff={userStaff}
                        userId={userId}
                        date={date}
                        onEdit={this.onEdit.bind(this,0)}
                        edited={edited}
                        file={file}
                        edit={edit && editId == 0}
                        onToggleEdit={this.onToggleEdit.bind(this, 0)}
                        allowAttachments={allowAttachments} />
                </div>
                <div className="ticket-viewer__comments">
                    {eventsWithModifiedComments && eventsWithModifiedComments.map(this.renderTicketEvent.bind(this, closed))}
                </div>
                {showResponseField ? this.renderResponseField() : this.renderReopenCloseButtons()}
            </div>
        );
    }

    renderReopenCloseButtons() {
        return(
            <div className="ticket-viewer__reopen-close-buttons">
                {this.renderReopenTicketButton()}
                {this.showDeleteButton() ? this.renderDeleteTicketButton() : null}
            </div>
        )
    }

    renderTitleHeader() {
        const {ticket, userStaff, userId} = this.props;
        const {ticketNumber, title, author, editedTitle, language} = ticket;

        return(
            <div className="ticket-viewer__header">
                <span className="ticket-viewer__number">#{ticketNumber}</span>
                <span className="ticket-viewer__title">{title}</span>
                <span className="ticket-viewer__flag">
                    <Icon name={(language === 'en') ? 'us' : language} />
                </span>
                {((author.id == userId && author.staff == userStaff) || userStaff) ? this.renderEditTitleOption() : null}
                {editedTitle ? this.renderEditedTitleText() : null }
            </div>
        )
    }

    renderEditableTitle(){
        return(
            <div className="ticket-viewer__header">
                <div className="ticket-viewer__edit-title-box">
                    <FormField
                        className="ticket-viewer___input-edit-title"
                        error={this.state.editTitleError}
                        value={this.state.newTitle}
                        field='input'
                        onChange={(e) => this.setState({newTitle: e.target.value})} />
                </div>
                <div className="ticket-viewer__edit-title__buttons">
                    <Button className="ticket-viewer__edit-title__button" disabled={this.state.editTitleLoading} type='primary' size="medium" onClick={() => this.setState({editTitle: false, newTitle: this.props.ticket.title})}>
                        {this.state.editTitleLoading ? <Loading /> : <Icon name="times" size="large" />}
                    </Button>
                    <Button className="ticket-viewer__edit-title__button" disabled={this.state.editTitleLoading} type='secondary' size="medium" onClick={this.changeTitle.bind(this)}>
                        {this.state.editTitleLoading ? <Loading /> : <Icon name="check" size="large" />}
                    </Button>
                </div>
            </div>
        )
    }

    renderEditableHeaders() {
        const { userStaff, ticket } = this.props;
        const filtersOnlyWithAuthor = {
            authors: [
                {
                    id: ticket.author.id*1,
                    isStaff: ticket.author.staff*1
                }
            ]
        };

        return (
            <div className="ticket-viewer__headers">
                <div className="ticket-viewer__info">
                    <div className="ticket-viewer__info-container-editable">
                        <div className="ticket-viewer__info-container-editable__column">
                            <div className="ticket-viewer__info-header">{i18n('DEPARTMENT')}</div>
                            <div className="ticket-viewer__info-value">
                                {
                                    this.state.editDepartment ?
                                        this.renderEditDepartment() :
                                        ticket.department.name
                                }
                            </div>
                        </div>
                        {userStaff ? this.renderEditOption("Department") : null}
                    </div>
                    <div className="ticket-viewer__info-container-editable">
                        <div className="ticket-viewer__info-container-editable__column">
                            <div className="ticket-viewer__info-header">{i18n('TAGS')}</div>
                            <div className="ticket-viewer__info-value">
                                {
                                    this.state.editTags ?
                                        this.renderEditTags() :
                                        this.renderTags()
                                }
                            </div>
                        </div>
                        {userStaff ? this.renderEditOption("Tags") : null}
                    </div>
                    <div className="ticket-viewer__info-container-editable">
                        <div className="ticket-viewer__info-container-editable__column">
                            <div className="ticket-viewer__info-header">{i18n('OWNER')}</div>
                            <div className="ticket-viewer__info-value">
                                {this.renderOwnerNode()}
                            </div>
                        </div>
                        {userStaff ? this.renderEditOption("Owner") : null}
                    </div>
                </div>
                <div className="ticket-viewer__info">
                    <div className="ticket-viewer__info-container-editable">
                        <div className="ticket-viewer__info-container-editable__column">
                            <div className="ticket-viewer__info-header">{i18n('AUTHOR')}</div>
                            <div className="ticket-viewer__info-value">
                                <a className="ticket-viewer__info-author-name" href={this.searchTickets(filtersOnlyWithAuthor)}>
                                    {ticket.author.name}
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="ticket-viewer__info-container-editable">
                        <div className="ticket-viewer__info-container-editable__column">
                            <div className="ticket-viewer__info-header">{i18n('STATUS')}</div>
                            <div className="ticket-viewer__info-value">
                                {this.state.editStatus ? this.renderEditStatus() : (ticket.closed ? i18n('CLOSED') : i18n('OPENED'))}
                            </div>
                        </div>
                        {userStaff ? this.renderEditOption("Status") : null}
                    </div>
                </div>
            </div>
        );
    }

    renderEditTags() {
        const { tags, ticket } = this.props;

        return (
            <div className="ticket-viewer__edit-tags">
                <TagSelector
                    items={tags}
                    values={ticket.tags}
                    onRemoveClick={this.removeTag.bind(this)}
                    onTagSelected={this.addTag.bind(this)}
                    loading={this.state.tagSelectorLoading} />
                {this.renderCancelButton("Tags", "CLOSE")}
            </div>
        );
    }

    renderEditStatus() {
        return  (
            <div className="ticket-viewer__edit-status__buttons">
                {this.renderCancelButton("Status", "CANCEL")}
                {this.props.ticket.closed ? this.renderReopenTicketButton() : this.renderCloseTicketButton()}
            </div>
        );
    }

    renderReopenTicketButton() {
        return (
            <Button type='secondary' size="medium" onClick={this.onReopenClick.bind(this)}>
                {i18n('RE_OPEN')}
            </Button>
        );
    }

    renderHeaders() {
        const ticket = this.props.ticket;

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
                        <div className="ticket-viewer__info-value">
                            {this.renderTags()}
                        </div>
                    </div>
                </div>
                <div className="ticket-viewer__info">
                    <div className="ticket-viewer__info-container">
                        <div className="ticket-viewer__info-header">{i18n('OWNER')}</div>
                        <div className="ticket-viewer__info-value">
                            {this.renderOwnerNode()}
                        </div>
                    </div>
                    <div className="ticket-viewer__info-container">
                        <div className="ticket-viewer__info-header">{i18n('STATUS')}</div>
                        <div className="ticket-viewer__info-value">
                            {i18n((ticket.closed) ? 'CLOSED' : 'OPENED')}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    renderTags() {
        const { ticket, tags } = this.props;
        const TAGS = (
            ticket.tags.length ?
                ticket.tags.map((tagName, index) => {
                    const tag = _.find(tags, {name: tagName});
                    return <Tag name={tag && tag.name} color={tag && tag.color} key={index} />
                }) :
                i18n('NONE')
        );

        return TAGS;
    }

    renderOwnerNode() {
        const { assignmentAllowed, ticket } = this.props;
        const filtersOnlyWithOwner = ticket.owner && {owners: [ticket.owner.id*1]};
        let ownerNode = null;

        if(assignmentAllowed && ticket.owner) {
            ownerNode = (
                <a className="ticket-viewer__info-owner-name" href={this.searchTickets(filtersOnlyWithOwner)}>
                    {ticketUtils.renderStaffSelected(ticket.owner)}
                </a>
            );
        } else {
            ownerNode = (
                <span className="ticket-viewer__info-owner-name">
                    {(ticket.owner) ? ticket.owner.name : i18n('NONE')}
                </span>
            );
        }

        return (assignmentAllowed && this.state.editOwner) ? this.renderEditOwner() : ownerNode;
    }

    renderEditOwner() {
        const items = this.getStaffAssignmentItems();
        const { ticket } = this.props;
        const ownerId = ticket.owner && ticket.owner.id*1;
        let selectedIndex = _.findIndex(items, {id: ownerId});
        selectedIndex = (selectedIndex !== -1) ? selectedIndex : 0;

        return (
            <div className="ticket-viewer__edit-owner">
                <DropDown
                    className="ticket-viewer__editable-dropdown" items={items}
                    selectedIndex={selectedIndex}
                    onChange={this.onAssignmentChange.bind(this)} />
                {this.renderCancelButton("Owner", "CANCEL")}
            </div>
        );
    }

    renderEditDepartment() {
        const { ticket } = this.props;
        const departments = this.getDepartmentsForTransfer();

        return  (
            <div className="ticket-viewer__edit-owner">
                <DepartmentDropdown
                    className="ticket-viewer__editable-dropdown"
                    departments={departments}
                    selectedIndex={_.findIndex(departments, {id: ticket.department.id})}
                    onChange={this.onDepartmentDropdownChanged.bind(this)} />
                {this.renderCancelButton("Department", "CANCEL")}
            </div>
        );
    }

    renderEditTitleOption() {
        return(
            <span className="ticket-viewer__edit-title-icon">
                <Icon name="pencil" onClick={() => this.setState({editTitle: true})} />
            </span>
        )
    }

    renderEditOption(option) {
        return(
            <span className="ticket-viewer__edit-icon">
                <Icon name="pencil" onClick={() => this.setState({["edit"+option]: true})} />
            </span>
        );
    }

    renderEditedTitleText(){
        return(
            <div className="ticket-viewer__edited-title-text"> {i18n('TITLE_EDITED')} </div>
        )
    }

    renderCancelButton(option, type) {
        return <Button type='link' size="medium" onClick={() => this.setState({["edit"+option]: false})}>{i18n(type)}</Button>
    }

    renderTicketEvent(isTicketClosed, ticketEventObject, index) {
        const { userStaff, ticket, userId, allowAttachments } = this.props;
        const { edit, editId } = this.state;
        const { content, author, id} = ticketEventObject;

        if(userStaff && typeof content === 'string') {
            ticketEventObject.content = MentionsParser.parse(content);
        }

        return (
            <TicketEvent
                {...ticketEventObject}
                isLastComment={ticketEventObject.isLastComment}
                author={(!_.isEmpty(author)) ? author : ticket.author}
                userStaff={userStaff}
                isTicketClosed={isTicketClosed}
                userId={userId}
                onEdit={this.onEdit.bind(this, id)}
                edit={edit && editId == id}
                onToggleEdit={this.onToggleEdit.bind(this, id)}
                key={index}
                allowAttachments={allowAttachments} />
        );
    }

    renderResponseField() {
        const { allowAttachments } = this.props;

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
                        <FormField name="content" validation="TEXT_AREA" required field="textarea" fieldProps={{allowImages: allowAttachments}} />
                        <div className="ticket-viewer__response-container">
                            <div className="ticket-viewer__response-buttons">
                                {allowAttachments ? <FormField name="file" field="file" /> : null}
                                <SubmitButton type="secondary">{i18n('RESPOND_TICKET')}</SubmitButton>
                            </div>
                            <div className="ticket-viewer__buttons-column">
                                <div className="ticket-viewer__buttons-row">
                                    {this.renderCloseTicketButton()}
                                </div>
                            </div>
                        </div>
                    </div>
                    {(this.state.commentError) ? this.renderCommentError() : null}
                </Form>
            </div>
        );
    }

    renderDeleteTicketButton() {
        return (
            <Button className="ticket-viewer__delete-button" size="medium" onClick={this.onDeleteTicketClick.bind(this)}>{i18n('DELETE_TICKET')}</Button>
        );
    }

    renderCloseTicketButton() {
        return (
            <Button size="medium" onClick={this.onCloseTicketClick.bind(this)}>{i18n('CLOSE_TICKET')}</Button>
        );
    }

    renderCustomResponses() {
        let customResponsesNode = null;

        if(this.props.customResponses && this.props.editable) {
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
                    <DropDown items={customResponses} size="medium" onChange={this.onCustomResponsesChanged.bind(this)} />
                </div>
            );
        }

        return customResponsesNode;
    }

    renderPrivate() {
        if(this.props.userStaff) {
            return (
                <div className="ticket-viewer__response-private">
                    <FormField label={i18n('PRIVATE')} name="private" field="checkbox" />
                    <InfoTooltip className="ticket-viewer__response-private-info" text={i18n('PRIVATE_RESPONSE_DESCRIPTION')} />
                </div>
            );
        } else {
            return null;
        }
    }

    renderCommentError() {
        const { showTicketCommentErrorMessage } = this.state;

        return (
            <Message
                showMessage={showTicketCommentErrorMessage}
                onCloseMessage={this.onCloseMessage.bind(this, "showTicketCommentErrorMessage")}
                className="ticket-viewer__message"
                type="error">
                    {i18n('TICKET_COMMENT_ERROR')}
            </Message>
        );
    }

    searchTickets(filters) {
        const SEARCH_TICKETS_PATH = '/admin/panel/tickets/search-tickets';
        const urlQuery = filters && searchTicketsUtils.getFiltersForURL({filters});

        return urlQuery && `${SEARCH_TICKETS_PATH}${urlQuery}`;
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
        AreYouSure.openModal(null, this.changeDepartment.bind(this, this.getDepartmentsForTransfer()[event.index].id));
    }

    onAssignmentChange(event) {
        AreYouSure.openModal(null, this.assingTo.bind(this, event.index));
    }

    assingTo(index) {
        const id = this.getStaffAssignmentItems()[index].id;
        const {ticketNumber, owner} = this.props.ticket;

        let APICallPromise = new Promise(resolve => resolve());

        if(owner) {
            APICallPromise = APICallPromise.then(() => API.call({
                path: '/staff/un-assign-ticket',
                data: { ticketNumber }
            }));
        }

        if(id !== 0) {
            APICallPromise = APICallPromise.then(() => API.call({
                path: '/staff/assign-ticket',
                data: { ticketNumber, staffId: id }
            }));
        }

        this.setState({
            editOwner: false
        });

        return APICallPromise.then(this.onTicketModification.bind(this));
    }

    onReopenClick() {
        this.setState({
            editStatus: false
        });

        AreYouSure.openModal(null, this.reopenTicket.bind(this));
    }

    onCloseTicketClick(event) {
        this.setState({
            editStatus: false
        });

        event.preventDefault();
        AreYouSure.openModal(null, this.closeTicket.bind(this));
    }

    onDeleteTicketClick(event) {
        event.preventDefault();
        AreYouSure.openModal(null, this.deleteTicket.bind(this));
    }

    changeTitle(){
        this.setState({
            editTitleLoading: true
        });
        API.call({
            path: '/ticket/edit-title',
            data: {
                ticketNumber: this.props.ticket.ticketNumber,
                title: this.state.newTitle
            }
        }).then(() => {
            this.setState({
                editTitle: false,
                editTitleError: false,
                editTitleLoading: false
            });
            this.onTicketModification();
        }).catch((result) => {
            this.setState({
                editTitleError: i18n(result.message),
                editTitleLoading: false
            })
        });
    }

    reopenTicket() {
        return API.call({
            path: '/ticket/re-open',
            data: {
                ticketNumber: this.props.ticket.ticketNumber
            }
        }).then(this.onTicketModification.bind(this));
    }

    closeTicket() {
        return API.call({
            path: '/ticket/close',
            data: {
                ticketNumber: this.props.ticket.ticketNumber
            }
        }).then(this.onTicketModification.bind(this));
    }

    deleteTicket() {
        return API.call({
            path: '/ticket/delete',
            data: {
                ticketNumber: this.props.ticket.ticketNumber
            }
        }).then((result) => {
             this.onTicketModification(result);
             history.push(history.goBack());
        });
    }

    changeDepartment(departmentId) {
        const { userId, userDepartments, ticket } = this.props;

        this.setState({
            editDepartment: false
        });

        return API.call({
            path: '/ticket/change-department',
            data: {
                ticketNumber: ticket.ticketNumber,
                departmentId
            }
        }).then((_.some(userDepartments, {id: departmentId}) || (userId === (ticket.author.id*1))) ? this.onTicketModification.bind(this) : history.goBack());
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

    onEdit(ticketeventid, {content}) {
        this.setState({
            loading: true
        });
        const data = {};

        if(ticketeventid) {
            data.ticketEventId = ticketeventid;
        } else {
            data.ticketNumber = this.props.ticket.ticketNumber;
        }

        API.call({
            path: '/ticket/edit-comment',
            data: _.extend(
                data,
                TextEditor.getContentFormData(content)
            )
        }).then(this.onEditCommentSuccess.bind(this), this.onEditCommentFail.bind(this));
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

    onEditCommentFail() {
        this.setState({
            loading: false,
            commentError: true,
            showTicketCommentErrorMessage: true
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
            commentFile: null,
            commentEdited: false
        });

        this.onTicketModification();
    }

    onCommentFail() {
        this.setState({
            loading: false,
            commentError: true,
            showTicketCommentErrorMessage: true
        });
    }

    onTicketModification() {
        const { onChange } = this.props;

        onChange && onChange();
    }

    getStaffAssignmentItems() {
        const { staffMembers, ticket } = this.props;
        let staffAssignmentItems = [
            {content: i18n('NONE'), contentOnSelected: i18n('NONE'), id: 0}
        ];

        staffAssignmentItems = staffAssignmentItems.concat(
            ticketUtils.getStaffList({staffList: staffMembers, ticket}, 'toDropDown').map(
                ({id, content}) => ({content, id: id*1})
            )
        );
        return staffAssignmentItems;
    }

    getCurrentStaff() {
        const { userId, staffMembers, ticket } = this.props;

        return _.find(staffMembers, ({id}) => {return id == userId});
    }

    getDepartmentsForTransfer() {
        return this.props.ticket.author.staff ? SessionStore.getDepartments() : this.getPublicDepartments();
    }

    showDeleteButton() {
        const { ticket, userLevel, userId, userStaff } = this.props;
        const { owner, author, closed } = ticket || {};
        const { staff, id } = author || {};

        if(!owner) {
            if(userLevel === 3) return true;
            if(userId == id*1) {
                return (userStaff && staff && closed);
            }
        }

        return false;
    }

    onCloseMessage(showMessage) {
        this.setState({
            [showMessage]: false
        });
    }
}

export default connect((store) => {
    return {
        userId: store.session.userId*1,
        userStaff: store.session.staff,
        userDepartments: store.session.userDepartments,
        staffMembers: store.adminData.staffMembers,
        staffMembersLoaded: store.adminData.staffMembersLoaded,
        allowAttachments: store.config['allow-attachments'],
        userLevel: store.session.userLevel*1,
        tags: store.config['tags'].map((tag) => {return {...tag, id: tag.id*1}})
    };
})(TicketViewer);
