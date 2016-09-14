import React from 'react';

import API from 'lib-app/api-call';

import Header from 'core-components/header';
import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import SubmitButton from 'core-components/submit-button';

class DashboardEditProfilePage extends React.Component {

    state = {
        loading: false
    };

    render() {
        return (
            <div className="edit-profile-page">
                <Header title="Edit Profile" description="adsfasdfasdfasdfasdf asdfa" />
                <div className="edit-profile-page__title">Edit Email</div>
                <Form loading={this.state.loading} onSubmit={this.onSubmit.bind(this)}>
                    <FormField name="newEmail" label="New Email" field="input" validation="EMAIL" required/>
                    <SubmitButton>CHANGE EMAIL</SubmitButton>
                </Form>
            </div>
        );
    }
    
    onSubmit(formState) {
        this.setState({
            loading: true
        });

        API.call({
            path: "/user/edit-email",
            data: {
                newEmail: formState.newEmail
            }
        }).then(function () {
            this.setState({
                loading: false
            });
        }.bind(this));
    }
}

export default DashboardEditProfilePage;
