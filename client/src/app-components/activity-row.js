import React from 'react';
import {Link} from 'react-router';

import Icon from 'core-components/icon';

import i18n from 'lib-app/i18n';

class ActivityRow extends React.Component {

    static propTypes = {
        type: React.PropTypes.oneOf([
            'COMMENT',
            'ASSIGN',
            'UN_ASSIGN',
            'CLOSE',
            'RE_OPEN',
            'DEPARTMENT_CHANGED',
            'PRIORITY_CHANGED'
        ]),
        ticketNumber: React.PropTypes.string,
        author: React.PropTypes.shape({
            name: React.PropTypes.string,
            staff: React.PropTypes.bool,
            id: React.PropTypes.string
        })
    };

    render() {
        return (
            <div className="activity-row">
                <Icon {...this.getIconProps()} className="activity-row__icon"/>
                <span>
                    <Link className="activity-row__name-link" to={this.getNameLinkDestination()}>
                        {this.props.author.name}
                    </Link>
                </span>
                <span className="activity-row__message"> {i18n('ACTIVITY_' + this.props.type)} </span>
                <span>
                    <Link className="activity-row__ticket-link" to={'/admin/panel/tickets/view-ticket/' + this.props.ticketNumber}>
                        #{this.props.ticketNumber}
                    </Link>
                </span>
                <span className="separator" />
            </div>
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
            'RE_OPEN': 'unlock-alt',
            'DEPARTMENT_CHANGED': 'exchange',
            'PRIORITY_CHANGED': 'exclamation'
        };

        return {
            name: iconName[this.props.type]
        }
    }
}

export default ActivityRow;