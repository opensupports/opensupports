import React from 'react';
import _ from 'lodash';

import Menu from 'core-components/menu';

let dashboardRoutes = [
    { path: '/app/dashboard', text: 'Ticket List', icon: 'file-text-o' },
    { path: '/app/dashboard/create-ticket', text: 'Create Ticket', icon: 'plus' },
    { path: '/app/dashboard/articles', text: 'View Articles', icon: 'book' },
    { path: '/app/dashboard/edit-profile', text: 'Edit Profile', icon: 'pencil' }
];

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
            header: 'Dashboard',
            items: this.getMenuItems(),
            selectedIndex: this.getSelectedIndex(),
            onItemClick: this.goToPathByIndex.bind(this),
            type: 'secondary'
        };
    }

    getMenuItems() {
        return dashboardRoutes.map(this.getMenuItem.bind(this));
    }

    getMenuItem(item) {
        return {
            content: item.text,
            icon: item.icon
        };
    }

    getSelectedIndex() {
        let pathname = this.props.location.pathname;

        return _.findIndex(dashboardRoutes, {path: pathname});
    }

    goToPathByIndex(itemIndex) {
        this.context.router.push(dashboardRoutes[itemIndex].path);
    }
}

export default DashboardMenu;
