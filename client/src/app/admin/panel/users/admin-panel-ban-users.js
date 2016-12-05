import React from 'react';
import _ from 'lodash';

import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';

import Header from 'core-components/header';
import Table from 'core-components/table';
import SearchBox from 'core-components/search-box';
import Button from 'core-components/button';
import SubmitButton from 'core-components/submit-button';
import Form from 'core-components/form';
import FormField from 'core-components/form-field';

class AdminPanelBanUsers extends React.Component {

    state = {
        loadingList: true,
        loadingForm: false,
        emails: [],
        filteredEmails: []
    };

    componentDidMount() {
        this.retrieveEmails()
    }

    render() {
        return (
            <div className="admin-panel-ban-users row">
                <Header title={i18n('BAN_USERS')} description={i18n('BAN_USERS_DESCRIPTION')} />
                <div className="admin-panel-ban-users__email-list col-md-6">
                    <SearchBox className="admin-panel-ban-users__search" onSearch={this.onSearch.bind(this)} searchOnType placeholder={i18n('SEARCH_EMAIL')}/>
                    <Table {...this.getTableProps()} />
                </div>
                <div className="admin-panel-ban-users__ban-email col-md-6">
                    <span className="admin-panel-ban-users__ban-email-title">
                        {i18n('BAN_NEW_EMAIL')}
                    </span>
                    <Form {...this.getFormProps()}>
                        <FormField className="admin-panel-ban-users__input" placeholder="email" name="email" validation="EMAIL" required fieldProps={{size: 'large'}}/>
                        <SubmitButton>{i18n('BAN_EMAIL')}</SubmitButton>
                    </Form>
                </div>
            </div>
        );
    }

    getTableProps() {
        return {
            loading: this.state.loadingList,
            headers: [{
                key: 'email',
                value: i18n('EMAIL_BANNED')
            }],
            pageSize: 10,
            rows: this.state.filteredEmails.map(this.getEmailRow.bind(this))
        };
    }

    getFormProps() {
        return {
            loading: this.state.loadingForm,
            onSubmit: this.onBanMailFormSubmit.bind(this)
        };
    }

    getEmailRow(email) {
        return {
            email: (
                <div className="admin-panel-ban-users__email-row">
                    {email}
                    <Button className="admin-panel-ban-users__un-ban-button" onClick={this.onUnBanClick.bind(this, email)} size="extra-small">
                        {i18n('UN_BAN')}
                    </Button>
                </div>
            )
        };
    }

    onSearch(query) {
        this.setState({
            filteredEmails: SearchBox.searchQueryInList(this.state.emails, query, _.startsWith, _.includes)
        });
    }

    onBanMailFormSubmit(form) {
        this.setState({
            loadingForm: true
        });

        API.call({
            path: '/user/ban',
            data: {
                email: form.email
            }
        }).then(this.retrieveEmails.bind(this));
    }

    onUnBanClick(email) {
        API.call({
            path: '/user/un-ban',
            data: {
                email: email
            }
        }).then(this.retrieveEmails.bind(this));
    }

    retrieveEmails() {
        this.setState({
            loadingList: true
        });

        API.call({
            path: '/user/list-ban',
            data: {}
        }).then((result) => {
            this.setState({
                loadingList: false,
                loadingForm: false,
                emails: result.data,
                filteredEmails: result.data
            });
        });
    }
}

export default AdminPanelBanUsers;