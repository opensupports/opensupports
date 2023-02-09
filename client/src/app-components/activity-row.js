import React from 'react';
import _ from 'lodash';
import {Link} from 'react-router';

import Icon from 'core-components/icon';

import i18n from 'lib-app/i18n';

class ActivityRow extends React.Component {

    static propTypes = {
        mode: React.PropTypes.oneOf(['staff', 'system']),
        type: React.PropTypes.oneOf([
            'COMMENT',
            'ASSIGN',
            'UN_ASSIGN',
            'CLOSE',
            'CREATE_TICKET',
            'RE_OPEN',
            'DEPARTMENT_CHANGED',
            'EDIT_TITLE',
            'EDIT_COMMENT',

            'EDIT_SETTINGS',
            'SIGNUP',
            'INVITE',
            'ADD_TOPIC',
            'ADD_ARTICLE',
            'DELETE_TOPIC',
            'DELETE_ARTICLE',
            'EDIT_ARTICLE',
            'ADD_STAFF',
            'ADD_DEPARTMENT',
            'DELETE_DEPARTMENT',
            'EDIT_DEPARTMENT',
            'ADD_CUSTOM_RESPONSE',
            'DELETE_CUSTOM_RESPONSE',
            'EDIT_CUSTOM_RESPONSE',
            'BAN_USER',
            'DELETE_USER',
            'UN_BAN_USER'
        ]),
        to: React.PropTypes.string,
        ticketNumber: React.PropTypes.string,
        author: React.PropTypes.shape({
            name: React.PropTypes.string,
            staff: React.PropTypes.bool,
            id: React.PropTypes.string
        })
    };

    render() {
        let ticketRelatedTypes = [
            'COMMENT',
            'ASSIGN',
            'UN_ASSIGN',
            'CLOSE',
            'CREATE_TICKET',
            'RE_OPEN',
            'DEPARTMENT_CHANGED',
            'COMMENT_EDITED',
            'EDIT_TITLE',
            'EDIT_COMMENT',
        ];

        return (
            <div className="activity-row">
                <Icon {...this.getIconProps()} className="activity-row__icon"/>
                <span>
                    {this.renderAuthorName()}
                </span>
                <span className="activity-row__message"> {i18n('ACTIVITY_' + this.props.type)} </span>
                {_.includes(ticketRelatedTypes, this.props.type) ? this.renderTicketNumber() : this.props.to}
                <span className="separator" />
            </div>
        );
    }

    renderAuthorName() {
        let name = this.props.author.name;

        if (this.props.author.id) {
            name = <Link className="activity-row__name-link" to={this.getNameLinkDestination()}>
                        {this.props.author.name}
                   </Link>;
        }

        return name;
    }

    renderTicketNumber() {
        let ticketNumber = (this.props.mode === 'staff') ? this.props.ticketNumber : this.props.to;

        return (
            <span>
                <Link className="activity-row__ticket-link" to={'/admin/panel/tickets/view-ticket/' + ticketNumber}>
                    #{ticketNumber}
                </Link>
            </span>
        );
    }

    getNameLinkDestination() {
        return (this.props.author.staff ? '/admin/panel/staff/view-staff/' : '/admin/panel/users/view-user/') + this.props.author.id;
    }

    getIconProps() {
        const iconName = {
            'COMMENT': 'comment-o',
            'ASSIGN': 'user',
            'UN_ASSIGN': 'user-times',
            'CLOSE': 'lock',
            'CREATE_TICKET': 'ticket',
            'RE_OPEN': 'unlock-alt',
            'DEPARTMENT_CHANGED': 'exchange',
            'EDIT_TITLE': 'edit',
            'EDIT_COMMENT': 'edit',

            'EDIT_SETTINGS': 'wrench',
            'SIGNUP': 'user-plus',
            'INVITE': 'user-plus',
            'ADD_TOPIC': 'book',
            'ADD_ARTICLE': 'book',
            'DELETE_TOPIC': 'book',
            'DELETE_ARTICLE': 'book',
            'EDIT_ARTICLE': 'book',
            'ADD_STAFF': 'id-card',
            'ADD_DEPARTMENT': 'university',
            'DELETE_DEPARTMENT': 'university',
            'EDIT_DEPARTMENT': 'university',
            'ADD_CUSTOM_RESPONSE': 'file',
            'DELETE_CUSTOM_RESPONSE': 'file',
            'EDIT_CUSTOM_RESPONSE': 'file',
            'BAN_USER': 'user-times',
            'DELETE_USER': 'user-times',
            'UN_BAN_USER': 'user'
        };

        return {
            name: iconName[this.props.type]
        }
    }
}

export default ActivityRow;
