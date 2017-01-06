import React from 'react';

import API from 'lib-app/api-call';
import i18n from 'lib-app/i18n';

import ActivityRow from 'app-components/activity-row';
import Header from 'core-components/header';
import Menu from 'core-components/menu';
import SubmitButton from 'core-components/submit-button';

class AdminPanelActivity extends React.Component {

    static childContextTypes = {
        loading: React.PropTypes.bool
    };

    getChildContext() {
        return {
            loading: this.state.loading
        };
    }

    state = {
        activities: [],
        page: 1,
        limit: false,
        loading: false,
        mode: 'staff'
    };

    componentDidMount() {
        this.retrieveNextPage();
    }

    render() {
        return (
            <div className="admin-panel-activity">
                <Header title={i18n('LAST_ACTIVITY')} />
                <Menu {...this.getMenuProps()} />
                {this.renderList()}
            </div>
        );
    }
    
    getMenuProps() {
        return {
            className: 'admin-panel-activity__menu',
            type: 'horizontal-list-bright',
            onItemClick: this.onMenuItemClick.bind(this),
            tabbable: true,
            items: [
                {
                    content: i18n('MY_NOTIFICATIONS'),
                    icon: ''
                },
                {
                    content: i18n('ALL_NOTIFICATIONS'),
                    icon: ''
                }
            ]
        };
    }

    renderList() {
        return (
            <div>
                {this.state.activities.map(this.renderRow.bind(this))}
                {(!this.state.limit) ? this.renderButton() : null}
            </div>
        );
    }

    renderButton() {
        return (
            <SubmitButton type="secondary" onClick={this.retrieveNextPage.bind(this)}>
                {i18n('LOAD_MORE')}
            </SubmitButton>
        );
    }

    renderRow(row, index) {
        return (
            <ActivityRow key={index} mode={this.state.mode} {...row} />
        );
    }

    onMenuItemClick(index) {
        this.setState({
            page: 0,
            mode: (index === 0) ? 'staff' : 'system',
            activities: []
        }, this.retrieveNextPage.bind(this));
    }

    retrieveNextPage() {
        this.setState({loading: true});

        API.call({
            path: (this.state.mode === 'staff') ? '/staff/last-events' : '/system/get-logs',
            data: {
                page: this.state.page
            }
        }).then(this.onRetrieveSuccess.bind(this));
    }

    onRetrieveSuccess(result) {
        this.setState({
            activities: this.state.activities.concat(result.data),
            page: this.state.page + 1,
            limit: (result.data.length !== 10),
            loading: false
        });
    }
}

export default AdminPanelActivity;