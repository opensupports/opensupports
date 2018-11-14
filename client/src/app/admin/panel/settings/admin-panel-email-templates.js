import React from 'react';
import _ from 'lodash';

import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';

import AreYouSure from 'app-components/are-you-sure';
import LanguageSelector from 'app-components/language-selector';

import Button from 'core-components/button';
import Header from 'core-components/header';
import Listing from 'core-components/listing';
import Loading from 'core-components/loading';
import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import SubmitButton from 'core-components/submit-button';

class AdminPanelEmailTemplates extends React.Component {

    state = {
        loadingList: true,
        loadingTemplate: false,
        templates: [],
        loadingForm: false,
        selectedIndex: -1,
        edited: false,
        errors: {},
        language: 'en',
        form: {
            subject: '',
            text1: '',
            text2: '',
            text3: '',
        }
    };

    componentDidMount() {
        this.retrieveMailTemplateList();
    }

    render() {
        return (
            <div className="admin-panel-email-templates">
                <Header title={i18n('EMAIL_TEMPLATES')} description={i18n('EMAIL_TEMPLATES_DESCRIPTION')} />
                {(!this.state.loadingList) ? this.renderContent() : this.renderLoading()}
            </div>
        );
    }

    renderContent() {
        return (
            <div className="row">
                <div className="col-md-3">
                    <Listing {...this.getListingProps()}/>
                </div>
                {(this.state.selectedIndex != -1) ? this.renderForm() : null}
            </div>
        );
    }

    renderLoading() {
        return (
            <div className="admin-panel-email-templates__loading">
                <Loading backgrounded size="large"/>
            </div>
        );
    }

    renderForm() {
        return (
            <div className="col-md-9">
                <FormField label={i18n('LANGUAGE')} decorator={LanguageSelector} value={this.state.language} onChange={event => this.onItemChange(this.state.selectedIndex, event.target.value)} fieldProps={{
                    type: 'allowed',
                    size: 'medium'
                }}/>
                <Form {...this.getFormProps()}>
                    <div className="row">
                        <div className="col-md-7">
                            <FormField label={i18n('SUBJECT')} name="subject" validation="TITLE" required fieldProps={{size: 'large'}}/>
                        </div>
                    </div>

                    <FormField label={i18n('TEXT') + '1'} name="text1" validation="TEXT_AREA" required decorator={'textarea'} fieldProps={{className: 'admin-panel-email-templates__text-area'}} />
                    {(this.state.form.text2) ? <FormField label={i18n('TEXT') + '2'} name="text2" validation="TEXT_AREA" required decorator={'textarea'} fieldProps={{className: 'admin-panel-email-templates__text-area'}} /> : null}
                    {(this.state.form.text3) ? <FormField label={i18n('TEXT') + '3'} name="text3" validation="TEXT_AREA" required decorator={'textarea'} fieldProps={{className: 'admin-panel-email-templates__text-area'}} /> : null}

                    <div className="admin-panel-email-templates__actions">
                        <div className="admin-panel-email-templates__save-button">
                            <SubmitButton type="secondary" size="small">{i18n('SAVE')}</SubmitButton>
                        </div>
                        <div className="admin-panel-email-templates__optional-buttons">
                            {(this.state.edited) ? this.renderDiscardButton() : null}
                            <div className="admin-panel-email-templates__recover-button">
                                <Button onClick={this.onRecoverClick.bind(this)} size="medium">
                                    {i18n('RECOVER_DEFAULT')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Form>
            </div>
        );
    }

    renderDiscardButton() {
        return (
            <div className="admin-panel-email-templates__discard-button">
                <Button onClick={this.onDiscardChangesClick.bind(this)} size="medium">
                    {i18n('DISCARD_CHANGES')}
                </Button>
            </div>
        );
    }

    getListingProps() {
        return {
            title: i18n('EMAIL_TEMPLATES'),
            items: this.getTemplateItems(),
            selectedIndex: this.state.selectedIndex,
            onChange: this.onItemChange.bind(this)
        };
    }

    getFormProps() {
        return {
            values: this.state.form,
            errors: this.state.errors,
            loading: this.state.loadingForm,
            onChange: (form) => {this.setState({form, edited: true})},
            onValidateErrors: (errors) => {this.setState({errors})},
            onSubmit: this.onFormSubmit.bind(this)
        }
    }

    getTemplateItems() {
        return this.state.templates.map((template) => {
            return {
                content: template
            };
        });
    }

    onItemChange(index, language) {
        if(this.state.edited) {
            AreYouSure.openModal(i18n('WILL_LOSE_CHANGES'), this.retrieveEmailTemplate.bind(this, index, language || this.state.language));
        } else {
            this.retrieveEmailTemplate(index, language || this.state.language);
        }
    }

    onFormSubmit(form) {
        const {selectedIndex, language, templates} = this.state;

        this.setState({loadingForm: true});

        API.call({
            path: '/system/edit-mail-template',
            data: {
                template: templates[selectedIndex],
                language,
                subject: form.subject,
                text1: form.text1,
                text2: form.text2,
                text3: form.text3,
            }
        }).then(() => {
            this.setState({loadingForm: false, edited: false});
        }).catch(response => {
            this.setState({
                loadingForm: false,
            });
            
            switch(response.message) {
                case 'INVALID_SUBJECT':
                    this.setState({
                        errors: {subject: 'Invalid syntax'}
                    });
                    break;
                case 'INVALID_TEXT_1':
                    this.setState({
                        errors: {text1: 'Invalid syntax'}
                    });
                break;
                case 'INVALID_TEXT_2':
                    this.setState({
                        errors: {text2: 'Invalid syntax'}
                    });
                break;
                case 'INVALID_TEXT_3':
                    this.setState({
                        errors: {text3: 'Invalid syntax'}
                    });
                break;
            }
        });
    }

    onDiscardChangesClick(event) {
        event.preventDefault();
        this.onItemChange(this.state.selectedIndex, this.state.language);
    }

    onRecoverClick(event) {
        event.preventDefault();
        AreYouSure.openModal(i18n('WILL_RECOVER_EMAIL_TEMPLATE'), this.recoverEmailTemplate.bind(this));
    }

    recoverEmailTemplate() {
        const {selectedIndex, language, templates} = this.state;

        API.call({
            path: '/system/recover-mail-template',
            data: {
                template: templates[selectedIndex],
                language
            }
        }).then(() => {
            this.retrieveEmailTemplate(this.state.selectedIndex, language);
        });
    }

    retrieveEmailTemplate(index, language) {
        this.setState({
            loadingForm: true,
        });

        API.call({
            path: '/system/get-mail-template',
            data: {template: this.state.templates[index], language}
        }).then((result) => this.setState({
            language,
            selectedIndex: index,
            edited: false,
            loadingForm: false,
            form: result.data,
            errors: {},
        }));
    }

    retrieveMailTemplateList() {
        API.call({
            path: '/system/get-mail-template-list',
            data: {}
        }).then((result) => this.setState({
            loadingList: false,
            templates: result.data
        }));
    }
}

export default AdminPanelEmailTemplates;
