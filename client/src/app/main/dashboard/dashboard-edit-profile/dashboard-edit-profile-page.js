import React from 'react';

import API from 'lib-app/api-call';
import i18n from 'lib-app/i18n';

import ModalContainer from 'app-components/modal-container';
import AreYouSure from 'app-components/are-you-sure';

import Header from 'core-components/header';
import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import SubmitButton from 'core-components/submit-button';
import Message from 'core-components/message';

class DashboardEditProfilePage extends React.Component {

    state= {
        loadingEmail: false,
        loadingPass: false,
        messageEmail:'',
        messagePass:''
    };

    render() {
        return (
            <div className="edit-profile-page">
                <Header title={i18n('EDIT_PROFILE')} description={i18n('EDIT_PROFILE_VIEW_DESCRIPTION')} />
                <div className="edit-profile-page__title">{i18n('EDIT_EMAIL')}</div>
                <Form loading={this.state.loadingEmail} onSubmit={this.onSubmitEditEmail.bind(this)}>
                    <FormField name="newEmail" label="New Email" field="input" validation="EMAIL" fieldProps={{size:'large'}} required/>
                    <SubmitButton>{i18n('CHANGE_EMAIL')}</SubmitButton>
                    {this.renderMessageEmail()}
                </Form>
                <div className="edit-profile-page__title">{i18n('EDIT_PASSWORD')}</div>
                <Form loading={this.state.loadingPass} onSubmit={this.onSubmitEditPassword.bind(this)}>
                    <FormField name="oldPassword" label={i18n('OLD_PASSWORD')} field="input" validation="PASSWORD" fieldProps={{password:true, size:'large'}} required/>
                    <FormField name="password" label={i18n('NEW_PASSWORD')} field="input" validation="PASSWORD" fieldProps={{password:true, size:'large'}} required/>
                    <FormField name="repeatNewPassword" label={i18n('REPEAT_NEW_PASSWORD')} field="input" validation="REPEAT_PASSWORD" fieldProps={{password:true ,size:'large'}} required/>
                    <SubmitButton>{i18n('CHANGE_PASSWORD')}</SubmitButton>
                    {this.renderMessagePass()}
                </Form>
            </div>
        );
    }
    renderMessageEmail() {
        switch (this.state.messageEmail) {
            case 'success':
                return <Message className="edit-profile-page__message" type="success">{i18n('EMAIL_CHANGED')}</Message>;
            case 'fail':
                return <Message className="edit-profile-page__message" type="error">{i18n('EMAIL_EXISTS')}</Message>;
            default:
                return null;
        }

    }
    renderMessagePass() {
        switch (this.state.messagePass) {
            case 'success':
                return <Message className="edit-profile-page__message" type="success">{i18n('PASSWORD_CHANGED')}</Message>;
            case 'fail':
                return <Message className="edit-profile-page__message" type="error">{i18n('OLD_PASSWORD_INCORRECT')}</Message>;
            default:
                return null;
        }
    }
    onSubmitEditEmail(formState) {
        ModalContainer.openModal(<AreYouSure onYes={this.callEditEmailAPI.bind(this, formState)}/>);
    }
    
    onSubmitEditPassword(formState) {
        ModalContainer.openModal(<AreYouSure onYes={this.callEditPassAPI.bind(this, formState)}/>);
    }

    callEditEmailAPI(formState){
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
                loadingEmail: false,
                messageEmail: "success"
            });
        }.bind(this)).catch(function (){
            this.setState({
                loadingEmail: false,
                messageEmail: 'fail'
            })
        }.bind(this));
    }

    callEditPassAPI(formState){
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
                loadingPass: false,
                messagePass: "success"
            });
        }.bind(this)).catch(function (){
            this.setState({
                loadingPass: false,
                messagePass: 'fail'
            })
        }.bind(this));
    }

}

export default DashboardEditProfilePage;
