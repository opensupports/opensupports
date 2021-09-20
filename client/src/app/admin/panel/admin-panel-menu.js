import React from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';

import i18n from 'lib-app/i18n';

import Menu from 'core-components/menu';
import queryString from 'query-string';

const INITIAL_PAGE = 1;


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
            type: 'horizontal'
        };
    }

    getGroupMenuProps() {
        return {
            items: this.getGroupItems(),
            selectedIndex: this.getGroupItemIndex(),
            onItemClick: this.onGroupItemClick.bind(this),
            tabbable: true,
            type: 'horizontal-list'
        };
    }

    getGroups() {
        return this.getRoutes().map((group) => {
            return {
                content: <span className="admin-panel-menu__item-text">{group.groupName}</span>,
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
        const item = group.items[index];

        this.context.router.push(item.path);
        item.onItemClick && item.onItemClick();
    }

    getGroupItemIndex() {
        const { location } = this.props;
        const search = window.location.search;
        const filtersInURL = queryString.parse(search);
        const group = this.getRoutes()[this.getGroupIndex()];
        const pathname = location.pathname + location.search;
        const SEARCH_TICKETS_PATH = '/admin/panel/tickets/search-tickets';

        return (
            _.findIndex(
                group.items,
                (item) => {
                    if(location.pathname === SEARCH_TICKETS_PATH) {
                        const customTicketsListNumber = queryString.parse(item.path.slice(SEARCH_TICKETS_PATH.length)).custom;
                        return item.path.includes(SEARCH_TICKETS_PATH) && customTicketsListNumber === filtersInURL.custom;
                    }
                    return item.path === pathname;
                }
            )
        );
    }

    getGroupIndex() {
        const pathname = this.props.location.pathname;
        const groupIndex = _.findLastIndex(this.getRoutes(), (group) => {
            return _.includes(pathname, group.path);
        });

        return (groupIndex === -1) ? 0 : groupIndex;
    }

    getCustomlists() {
        if(window.customTicketList){
            return window.customTicketList.map((item, index) => {
                return {
                    name: item.title,
                    path: `/admin/panel/tickets/search-tickets?custom=${index}&page=${INITIAL_PAGE}&useInitialValues=true`,
                    level: 1,
                }
            })
        } else {
            return [];
        }
    }

    getRoutes() {
        const customLists = this.getCustomlists();

        return this.getItemsByFilteredByLevel(_.without([
            {
                groupName: i18n('DASHBOARD'),
                path: '/admin/panel',
                icon: 'tachometer',
                level: 1,
                items: this.getItemsByFilteredByLevel([
                    {
                        name: i18n('LAST_ACTIVITY'),
                        path: '/admin/panel/activity',
                        level: 1
                    },
                    {
                        name: i18n('STATISTICS'),
                        path: '/admin/panel/stats',
                        level: 1
                    }
                ])
            },
            {
                groupName: i18n('TICKETS'),
                path: '/admin/panel/tickets',
                icon: 'ticket',
                level: 1,
                items: this.getItemsByFilteredByLevel([
                    {
                        name: i18n('MY_TICKETS'),
                        path: '/admin/panel/tickets/my-tickets',
                        level: 1
                    },
                    {
                        name: i18n('NEW_TICKETS'),
                        path: '/admin/panel/tickets/new-tickets',
                        level: 1
                    },
                    {
                        name: i18n('SEARCH_TICKETS'),
                        path: `/admin/panel/tickets/search-tickets?page=${INITIAL_PAGE}&useInitialValues=true`,
                        level: 1,
                    },
                    {
                        name: i18n('CUSTOM_RESPONSES'),
                        path: '/admin/panel/tickets/custom-responses',
                        level: 2
                    },
                    ...customLists
                ])
            },
            {
                groupName: i18n('USERS'),
                path: '/admin/panel/users',
                icon: 'user',
                level: 1,
                items: this.getItemsByFilteredByLevel([
                    {
                        name: i18n('LIST_USERS'),
                        path: '/admin/panel/users/list-users',
                        level: 1
                    },
                    {
                        name: i18n('BAN_USERS'),
                        path: '/admin/panel/users/ban-users',
                        level: 1
                    },
                    {
                        name: i18n('CUSTOM_FIELDS'),
                        path: '/admin/panel/users/custom-fields',
                        level: 1
                    }
                ])
            },
            {
                groupName: i18n('ARTICLES'),
                path: '/admin/panel/articles',
                icon: 'book',
                level: 2,
                items: this.getItemsByFilteredByLevel([
                    {
                        name: i18n('LIST_ARTICLES'),
                        path: '/admin/panel/articles/list-articles',
                        level: 2
                    }
                ])
            },
            {
                groupName: i18n('STAFF'),
                path: '/admin/panel/staff',
                icon: 'users',
                level: 3,
                items: this.getItemsByFilteredByLevel([
                    {
                        name: i18n('STAFF_MEMBERS'),
                        path: '/admin/panel/staff/staff-members',
                        level: 3
                    },
                    {
                        name: i18n('DEPARTMENTS'),
                        path: '/admin/panel/staff/departments',
                        level: 3
                    }
                ])
            },
            {

                groupName: i18n('SETTINGS'),
                path: '/admin/panel/settings',
                icon: 'cogs',
                level: 3,
                items: this.getItemsByFilteredByLevel([
                    {
                        name: i18n('SYSTEM_PREFERENCES'),
                        path: '/admin/panel/settings/system-preferences',
                        level: 3
                    },
                    {
                        name: i18n('ADVANCED_SETTINGS'),
                        path: '/admin/panel/settings/advanced-settings',
                        level: 3
                    },
                    {
                        name: i18n('EMAIL_SETTINGS'),
                        path: '/admin/panel/settings/email-settings',
                        level: 3
                    },
                    {
                        name: i18n('CUSTOM_TAGS'),
                        path: '/admin/panel/settings/custom-tags',
                        level: 3
                    }
                ])
            }
        ], null));
    }

    getItemsByFilteredByLevel(items) {
        return (this.props.level) ? _.filter(items, route => this.props.level >= route.level) : items;
    }
}

export default connect((store) => {
    return {
        level: store.session.userLevel,
        config: store.config,
        searchFilters: store.searchFilters,
    };
})(AdminPanelMenu);
