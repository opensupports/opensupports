import React from 'react';
import _ from 'lodash';

import store from 'app/store';
import SessionActions from 'actions/session-actions';
import i18n from 'lib-app/i18n';

import Menu from 'core-components/menu';

class DashboardMenu extends React.Component {
    static contextTypes = {
        router: React.PropTypes.object
    };

    static propTypes = {
        location: React.PropTypes.object
    };

    render() {
        return (
            <Menu {...this.getProps()} />
        );
    }

    getProps() {
        return {
            header: i18n('DASHBOARD'),
            items: this.getMenuItems(),
            selectedIndex: this.getSelectedIndex(),
            onItemClick: this.onItemClick.bind(this),
            tabbable: true,
            type: 'secondary'
        };
    }

    getMenuItems() {
        let items = this.getDashboardRoutes().map(this.getMenuItem.bind(this));

        items.push(this.getCloseSessionItem());

        return items;
    }

    getMenuItem(item) {
        return {
            content: item.text,
            icon: item.icon
        };
    }

    getCloseSessionItem() {
        return {
            content: i18n('CLOSE_SESSION'),
            icon: 'lock'
        }
    }

    getSelectedIndex() {
        let pathname = this.props.location.pathname;

        return _.findIndex(this.getDashboardRoutes(), {path: pathname});
    }

    onItemClick(itemIndex) {
        if (itemIndex < this.getDashboardRoutes().length) {
            this.goToPathByIndex(itemIndex)
        } else {
            store.dispatch(SessionActions.logout());
        }
    }

    goToPathByIndex(itemIndex) {
        this.context.router.push(this.getDashboardRoutes()[itemIndex].path);
    }
    
    getDashboardRoutes() {
        return [
            { path: '/dashboard', text: i18n('TICKET_LIST'), icon: 'file-text-o' },
            { path: '/dashboard/create-ticket', text: i18n('CREATE_TICKET'), icon: 'plus' },
            { path: '/dashboard/articles', text: i18n('VIEW_ARTICLES'), icon: 'book' },
            { path: '/dashboard/edit-profile', text: i18n('EDIT_PROFILE'), icon: 'pencil' }
        ];
    }
}

export default DashboardMenu;
