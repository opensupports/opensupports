import React from 'react';
import _ from 'lodash';

import {dispatch} from 'app/store';
import i18n from 'lib-app/i18n';

import Menu from 'core-components/menu';

class AdminPanelMenu extends React.Component {
    static contextTypes = {
        router: React.PropTypes.object
    };

    static propTypes = {
        location: React.PropTypes.object
    };

    render() {
        return (
            <div className="admin-panel-menu">
                <Menu {...this.getGroupsMenuProps()} />
                <Menu {...this.getGroupMenuProps()} />
            </div>
        );
    }

    getGroupsMenuProps() {
        return {
            items: this.getGroups(),
            selectedIndex: this.getGroupIndex(),
            onItemClick: this.onGroupClick.bind(this),
            tabbable: true,
            type: 'primary'
        };
    }

    getGroupMenuProps() {
        return {
            items: this.getGroupItems(),
            selectedIndex: this.getGroupItemIndex(),
            onItemClick: this.onGroupItemClick.bind(this),
            tabbable: true,
            type: 'secondary'
        };
    }

    getGroups() {
        return this.getRoutes().map((group) => {
            return {
                content: group.groupName,
                icon: group.icon
            };
        });
    }

    getGroupItems() {
        const group = this.getRoutes()[this.getGroupIndex()];

        return group.items.map((item) => {
            return {
                content: item.name
            };
        });
    }

    onGroupClick(index) {
        this.context.router.push(this.getRoutes()[index].path);
    }

    onGroupItemClick(index) {
        const group = this.getRoutes()[this.getGroupIndex()];

        this.context.router.push(group.items[index].path);
    }

    getGroupItemIndex() {
        const group = this.getRoutes()[this.getGroupIndex()];
        const pathname = this.props.location.pathname;
        const itemIndex = _.findIndex(group.items, {path: pathname});

        return (itemIndex === -1) ? 0 : itemIndex;
    }

    getGroupIndex() {
        const pathname = this.props.location.pathname;
        const groupIndex = _.findLastIndex(this.getRoutes(), (group) => {
            return _.includes(pathname, group.path);
        });

        return (groupIndex === -1) ? 0 : groupIndex;
    }

    getRoutes() {
        return [
            {
                groupName: i18n('DASHBOARD'),
                path: '/admin/panel',
                icon: 'tachometer',
                items: [
                    {
                        name: i18n('TICKET_STATS'),
                        path: '/admin/panel/stats'
                    },
                    {
                        name: i18n('LAST_ACTIVITY'),
                        path: '/admin/panel/activity'
                    }
                ]
            },
            {
                groupName: i18n('TICKETS'),
                path: '/admin/panel/tickets',
                icon: 'ticket',
                items: [
                    {
                        name: i18n('MY_TICKETS'),
                        path: '/admin/panel/tickets/my-tickets'
                    },
                    {
                        name: i18n('NEW_TICKETS'),
                        path: '/admin/panel/tickets/new-tickets'
                    },
                    {
                        name: i18n('ALL_TICKETS'),
                        path: '/admin/panel/tickets/all-tickets'
                    },
                    {
                        name: i18n('CUSTOM_RESPONSES'),
                        path: '/admin/panel/tickets/custom-responses'
                    }
                ]
            },
            {
                groupName: i18n('USERS'),
                path: '/admin/panel/users',
                icon: 'user',
                items: [
                    {
                        name: i18n('LIST_USERS'),
                        path: '/admin/panel/users/list-users'
                    },
                    {
                        name: i18n('BAN_USERS'),
                        path: '/admin/panel/users/ban-users'
                    }
                ]
            },
            {
                groupName: i18n('ARTICLES'),
                path: '/admin/panel/articles',
                icon: 'book',
                items: [
                    {
                        name: i18n('LIST_ARTICLES'),
                        path: '/admin/panel/articles/list-articles'
                    }
                ]
            },
            {

                groupName: i18n('STAFF'),
                path: '/admin/panel/staff',
                icon: 'users',
                items: [
                    {
                        name: i18n('STAFF_MEMBERS'),
                        path: '/admin/panel/staff/staff-members'
                    },
                    {
                        name: i18n('DEPARTMENTS'),
                        path: '/admin/panel/staff/departments'
                    }
                ]
            },
            {

                groupName: i18n('SETTINGS'),
                path: '/admin/panel/settings',
                icon: 'cogs',
                items: [
                    {
                        name: i18n('SYSTEM_PREFERENCES'),
                        path: '/admin/panel/settings/system-preferences'
                    },
                    {
                        name: i18n('USER_SYSTEM'),
                        path: '/admin/panel/settings/user-system'
                    },
                    {
                        name: i18n('EMAIL_TEMPLATES'),
                        path: '/admin/panel/settings/email-templates'
                    },
                    {
                        name: i18n('FILTERS_CUSTOM_FIELDS'),
                        path: '/admin/panel/settings/custom-fields'
                    }
                ]
            }
        ];
    }
}

export default AdminPanelMenu;
