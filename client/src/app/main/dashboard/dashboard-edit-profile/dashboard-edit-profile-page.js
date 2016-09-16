import React from 'react';

import API from 'lib-app/api-call';

import Header from 'core-components/header';
import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import SubmitButton from 'core-components/submit-button';

class DashboardEditProfilePage extends React.Component {

    state= {
        loadingEmail: false,
        loadingPass: false
    };


    render() {
        return (
            <div className="edit-profile-page">
                <Header title="Edit Profile" description="what ever" />
                <div className="edit-profile-page__title">Edit Email</div>
                <Form loading={this.state.loadingEmail} onSubmit={this.onSubmitEditEmail.bind(this)}>
                    <FormField name="newEmail" label="New Email" field="input" validation="EMAIL" fieldProps={{size:'large'}} required/>
                    <SubmitButton>CHANGE EMAIL</SubmitButton>
                </Form>
                <div className="edit-profile-page__title">Edit password</div>
                <Form loading={this.state.loadingPass} onSubmit={this.onSubmitEditPassword.bind(this)}>
                    <FormField name="oldPassword" label="Old Password" field="input" validation="PASSWORD" fieldProps={{password:true ,size:'large'}} required/>
                    <FormField name="password" label="New Password" field="input" validation="PASSWORD" fieldProps={{password:true ,size:'large'}} required/>
                    <FormField name="repeatNewPassword" label="Repeat New Password" field="input" validation="REPEAT_PASSWORD" fieldProps={{password:true ,size:'large'}} required/>
                    <SubmitButton>CHANGE PASSWORD</SubmitButton>
                </Form>
            </div>
        );
    }
    
    onSubmitEditEmail(formState) {
        this.setState({
            loadingEmail: true
        });

        API.call({
            path: "/user/edit-email",
            data: {
                newEmail: formState.newEmail
            }
        }).then(function () {
            this.setState({
                loadingEmail: false
            });
        }.bind(this));
    }
    
    onSubmitEditPassword(formState) {
        this.setState({
            loadingPass: true
        });

        API.call({
            path: "/user/edit-password",
            data: {
                oldPassword: formState.oldPassword,
                newPassword: formState.password
            }
        }).then(function () {
            this.setState({
                loadingPass: false
            });
        }.bind(this));
    }
}

export default DashboardEditProfilePage;
