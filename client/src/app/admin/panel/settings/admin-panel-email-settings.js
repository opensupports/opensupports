import React from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import randomString from 'random-string';

import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';

import AreYouSure from 'app-components/are-you-sure';
import LanguageSelector from 'app-components/language-selector';
import PopupMessage from 'app-components/popup-message';

import Button from 'core-components/button';
import Header from 'core-components/header';
import Listing from 'core-components/listing';
import Loading from 'core-components/loading';
import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import SubmitButton from 'core-components/submit-button';
import Message from 'core-components/message';

class AdminPanelEmailSettings extends React.Component {

    static propTypes = {
        language: React.PropTypes.string,
    };

    state = {
        headerImage: '',
        loadingHeaderImage: false,
        loadingList: true,
        loadingTemplate: false,
        templates: [],
        loadingForm: false,
        selectedIndex: -1,
        edited: false,
        errors: {},
        language: this.props.language,
        imapLoading: false,
        smtpLoading: false,
        form: {
            subject: '',
            text1: '',
            text2: '',
            text3: '',
        },
        emailForm: {
            ['server-email']: '',
        },
        smtpForm: {
            ['smtp-host']: '',
            ['smtp-user']: '',
            ['smtp-pass']: 'HIDDEN',
        },
        imapForm: {
            ['imap-host']: '',
            ['imap-user']: '',
            ['imap-pass']: 'HIDDEN',
            ['imap-token']: '',
        },
    };

    componentDidMount() {
        this.retrieveMailTemplateList();
        this.retrieveHeaderImage();
    }

    render() {
        return (
            <div className="admin-panel-email-settings">
                {(!this.state.loadingList) ? this.renderContent() : this.renderLoading()}
            </div>
        );
    }

    renderContent() {
        return (
            <div>
                {this.renderEmailSettings()}
                <Header title={i18n('EMAIL_TEMPLATES')} description={i18n('EMAIL_TEMPLATES_DESCRIPTION')} />
                <div className="row">
                    <div className="col-md-3">
                        <Listing {...this.getListingProps()} />
                    </div>
                    {(this.state.selectedIndex !== -1) ? this.renderForm() : null}
                </div>
            </div>
        );
    }

    renderLoading() {
        return (
            <div className="admin-panel-email-settings__loading">
                <Loading backgrounded size="large" />
            </div>
        );
    }

    renderEmailSettings() {
        return (
            <div>
                <Header title={i18n('EMAIL_SETTINGS')} description={i18n('EMAIL_SETTINGS_DESCRIPTION')} />
                <Form className="admin-panel-email-settings__email-form"
                      onSubmit={this.submitEmailAddress.bind(this)}
                      onChange={emailForm => this.setState({emailForm})}
                      values={this.state.emailForm}>
                    <div className="admin-panel-email-settings__email-container">
                        <FormField className="admin-panel-email-settings__email-server-address"
                                name="server-email"
                                label={i18n('EMAIL_SERVER_ADDRESS')}
                                fieldProps={{size: 'large'}}
                                infoMessage={i18n('EMAIL_SERVER_ADDRESS_DESCRIPTION')} />
                        <SubmitButton className="admin-panel-email-settings__submit" type="secondary"
                                    size="small">{i18n('SAVE')}</SubmitButton>
                    </div>
                </Form>

                <Form className="admin-panel-email-settings__image-form"
                      values={{headerImage: this.state.headerImage}}
                      onChange={form => this.setState({headerImage: form.headerImage})}
                      onSubmit={this.onHeaderImageSubmit.bind(this)}>
                    <div className="admin-panel-email-settings__image-container">
                        <FormField className="admin-panel-email-settings__image-header-url"
                                   label={i18n('IMAGE_HEADER_URL')} name="headerImage" required
                                   infoMessage={i18n('IMAGE_HEADER_DESCRIPTION')}
                                   fieldProps={{size: 'large'}} />
                        <SubmitButton className="admin-panel-email-settings__image-header-submit" type="secondary"
                                      size="small">{i18n('SAVE')}</SubmitButton>
                    </div>
                </Form>

                <div className="admin-panel-email-settings__servers">
                    <div className="admin-panel-email-settings__box">
                        <Header title={i18n('SMTP_SERVER')} description={i18n('SMTP_SERVER_DESCRIPTION')} />
                        <Form onSubmit={this.submitSMTP.bind(this)} onChange={smtpForm => this.setState({smtpForm})}
                              values={this.state.smtpForm} loading={this.state.smtpLoading}>
                            <FormField name="smtp-host" label={i18n('SMTP_SERVER')} fieldProps={{size: 'large'}} />
                            <FormField name="smtp-user" label={i18n('SMTP_USER')} fieldProps={{size: 'large'}} />
                            <FormField name="smtp-pass" label={i18n('SMTP_PASSWORD')} fieldProps={{size: 'large', autoComplete: 'off'}} />
                            <div className="admin-panel-email-settings__server-form-buttons">
                                <SubmitButton type="tertiary" size="small" onClick={this.testSMTP.bind(this)}>
                                    {i18n('TEST')}
                                </SubmitButton>
                                <SubmitButton className="admin-panel-email-settings__submit" type="secondary" size="small">
                                    {i18n('SAVE')}
                                </SubmitButton>
                            </div>
                        </Form>
                    </div>

                    <div className="admin-panel-email-settings__box">
                        <Header title={i18n('IMAP_SERVER')} description={i18n('IMAP_SERVER_DESCRIPTION')} />
                        <Form onSubmit={this.submitIMAP.bind(this)} onChange={imapForm => this.setState({imapForm})}
                              values={this.state.imapForm} loading={this.state.imapLoading}>
                            <FormField name="imap-host" label={i18n('IMAP_SERVER')} fieldProps={{size: 'large'}} />
                            <FormField name="imap-user" label={i18n('IMAP_USER')} fieldProps={{size: 'large'}} />
                            <FormField name="imap-pass" label={i18n('IMAP_PASSWORD')} fieldProps={{size: 'large', autoComplete: 'off'}} />
                            <FormField
                                name="imap-token"
                                label={i18n('IMAP_TOKEN')}
                                infoMessage={i18n('IMAP_TOKEN_DESCRIPTION')}
                                fieldProps={{size: 'large', icon: 'refresh', onIconClick: this.generateImapToken.bind(this)}} />
                            <div className="admin-panel-email-settings__server-form-buttons">
                                <SubmitButton type="tertiary" size="small" onClick={this.testIMAP.bind(this)}>
                                    {i18n('TEST')}
                                </SubmitButton>
                                <SubmitButton className="admin-panel-email-settings__submit" type="secondary" size="small">
                                    {i18n('SAVE')}
                                </SubmitButton>
                            </div>
                        </Form>
                        <Message showCloseButton={false} className="admin-panel-email-settings__imap-message" type="info">
                            {i18n('IMAP_POLLING_DESCRIPTION', {url: `${apiRoot}/system/email-polling`})}
                        </Message>
                    </div>
                </div>
            </div>
        );
    }

    renderForm() {
        const { form, language, selectedIndex, edited } = this.state;
        const { template, text2, text3} = form;

        return (
            <div className="col-md-9">
                <FormField label={i18n('LANGUAGE')} decorator={LanguageSelector} value={language}
                           onChange={event => this.onItemChange(selectedIndex, event.target.value)}
                           fieldProps={{
                               type: 'supported',
                               size: 'medium'
                           }} />
                <Form {...this.getFormProps()}>
                    <div className="row">
                        <div className="col-md-7">
                            <FormField
                                fieldProps={{size: 'large'}}
                                label={i18n('SUBJECT')}
                                name="subject"
                                validation="TITLE"
                                required />
                        </div>
                    </div>

                    <FormField
                        fieldProps={{className: 'admin-panel-email-settings__text-area'}}
                        label={i18n('TEXT') + '1'}
                        key="text1"
                        name="text1"
                        validation="TEXT_AREA"
                        required
                        decorator={'textarea'} />
                    {
                        (text2 || text2 === "") ?
                            <FormField
                                fieldProps={{className: 'admin-panel-email-settings__text-area'}}
                                label={i18n('TEXT') + '2'}
                                key="text2"
                                name="text2"
                                validation="TEXT_AREA"
                                required
                                decorator={'textarea'} /> :
                            null
                    }
                    {
                        ((text3 || text3 === "") && (template !== "USER_PASSWORD" && template !== "USER_EMAIL")) ?
                            <FormField
                                fieldProps={{className: 'admin-panel-email-settings__text-area'}}
                                label={i18n('TEXT') + '3'}
                                key="text3"
                                name="text3"
                                validation={(template !== "USER_PASSWORD" && template !== "USER_EMAIL") ? "TEXT_AREA" : ""}
                                required={(template !== "USER_PASSWORD" && template !== "USER_EMAIL")}
                                decorator={'textarea'} /> :
                            null
                    }

                    <div className="admin-panel-email-settings__actions">
                        <div className="admin-panel-email-settings__optional-buttons">
                            <div className="admin-panel-email-settings__recover-button">
                                <Button onClick={this.onRecoverClick.bind(this)} size="medium">
                                    {i18n('RECOVER_DEFAULT')}
                                </Button>
                            </div>
                            {edited ? this.renderDiscardButton() : null}
                        </div>
                        <div className="admin-panel-email-settings__save-button">
                            <SubmitButton key="submit-email-template" type="secondary" size="small">
                                    {i18n('SAVE')}
                            </SubmitButton>
                        </div>
                    </div>
                </Form>
            </div>
        );
    }

    renderDiscardButton() {
        return (
            <div className="admin-panel-email-settings__discard-button">
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
        const { form, errors, loadingForm } = this.state;

        return {
            values: form,
            errors,
            loading: loadingForm,
            onChange: (form) => {
                this.setState({form, edited: true})
            },
            onValidateErrors: (errors) => {
                this.setState({errors})
            },
            onSubmit: this.onFormSubmit.bind(this, form)
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
        if (this.state.edited) {
            AreYouSure.openModal(i18n('WILL_LOSE_CHANGES'), this.retrieveEmailTemplate.bind(this, index, language || this.state.language));
        } else {
            this.retrieveEmailTemplate(index, language || this.state.language);
        }
    }

    onHeaderImageSubmit(form) {
        this.setState({
            loadingHeaderImage: true,
        });

        API.call({
            path: '/system/edit-settings',
            data: {
                'mail-template-header-image': form['headerImage']
            }
        }).then(() => this.setState({
            loadingHeaderImage: false,
        }))
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

            switch (response.message) {
                case 'INVALID_SUBJECT':
                    this.setState({
                        errors: {subject: i18n('INVALID_SYNTAX')}
                    });
                    break;
                case 'INVALID_TEXT_1':
                    this.setState({
                        errors: {text1: i18n('INVALID_SYNTAX')}
                    });
                    break;
                case 'INVALID_TEXT_2':
                    this.setState({
                        errors: {text2: i18n('INVALID_SYNTAX')}
                    });
                    break;
                case 'INVALID_TEXT_3':
                    this.setState({
                        errors: {text3: i18n('INVALID_SYNTAX')}
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

    generateImapToken() {
        this.setState({
            imapForm: {
                ...this.state.imapForm,
                ['imap-token']: randomString({length: 20}),
            }
        });
    }

    submitEmailAddress(form) {
        this.editSettings(form, 'EMAIL_SUCCESS');
    }

    submitSMTP(form) {
        this.setState({
            smtpLoading: true
        });

        this.editSettings(form, 'SMTP_SUCCESS')
        .then(() => this.setState({
            smtpLoading: false
        }));
    }

    submitIMAP(form) {
        this.setState({
            imapLoading: true
        });

        this.editSettings(form, 'IMAP_SUCCESS')
        .then(() => this.setState({
            imapLoading: false
        }));
    }

    editSettings(form, successMessage) {
        return API.call({
            path: '/system/edit-settings',
            data: this.parsePasswordField(form)
        }).then(() => PopupMessage.open({
            title: i18n('SETTINGS_UPDATED'),
            children: i18n(successMessage),
            type: 'success'
        })).catch(response => PopupMessage.open({
            title: i18n('ERROR_UPDATING_SETTINGS'),
            children: response.message,
            type: 'error'
        }));
    }

    testSMTP(event) {
        event.preventDefault();

        this.setState({
            smtpLoading: true
        });

        API.call({
            path: '/system/test-smtp',
            data: this.parsePasswordField(this.state.smtpForm)
        }).then(() => PopupMessage.open({
            title: `${i18n('SUCCESSFUL_CONNECTION')}: SMTP`,
            children: i18n('SERVER_CREDENTIALS_WORKING'),
            type: 'success',
        })).catch(response => PopupMessage.open({
            title: `${i18n('UNSUCCESSFUL_CONNECTION')}: SMTP`,
            children: `${i18n('SERVER_ERROR')}: ${response.message}`,
            type: 'error',
        })).then(() => this.setState({
            smtpLoading: false
        }));
    }

    testIMAP(event) {
        event.preventDefault();

        this.setState({
            imapLoading: true
        });

        API.call({
            path: '/system/test-imap',
            data: this.parsePasswordField(this.state.imapForm)
        }).then(() => PopupMessage.open({
            title: `${i18n('SUCCESSFUL_CONNECTION')}: IMAP`,
            children: i18n('SERVER_CREDENTIALS_WORKING'),
            type: 'success',
        })).catch(response => PopupMessage.open({
            title: `${i18n('UNSUCCESSFUL_CONNECTION')}: IMAP`,
            children: `${i18n('SERVER_ERROR')}: ${response.message}`,
            type: 'error',
        })).then(() => this.setState({
            imapLoading: false
        }));
    }

    recoverEmailTemplate() {
        const {selectedIndex, language, templates} = this.state;

        return API.call({
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

        return API.call({
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

    retrieveHeaderImage() {
        API.call({
            path: '/system/get-settings',
            data: {allSettings: 1}
        }).then(result => this.setState({
            headerImage: result.data['mail-template-header-image'] || '',
            emailForm: {
                ['server-email']: result.data['server-email'] || '',
            },
            smtpForm: {
                ['smtp-host']: result.data['smtp-host'] || '',
                ['smtp-user']: result.data['smtp-user'] || '',
                ['smtp-pass']: 'HIDDEN',
            },
            imapForm: {
                ['imap-host']: result.data['imap-host'] || '',
                ['imap-user']: result.data['imap-user'] || '',
                ['imap-pass']: 'HIDDEN',
                ['imap-token']: result.data['imap-token'] || '',
            },
        }));
    }

    parsePasswordField(form) {
        let parsedForm = _.extend({}, form);

        delete parsedForm['smtp-pass'];
        delete parsedForm['imap-pass'];

        return _.extend(parsedForm, {
            [ form['smtp-pass'] && form['smtp-pass'] !== 'HIDDEN' ? 'smtp-pass' : null]: form['smtp-pass'],
            [ form['imap-pass'] && form['imap-pass'] !== 'HIDDEN' ? 'imap-pass' : null]: form['imap-pass'],
        })
    }
}

export default connect((store) => {
    return {
        language: store.config.language,
    };
})(AdminPanelEmailSettings);
