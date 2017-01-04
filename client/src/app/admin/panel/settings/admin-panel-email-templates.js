import React from 'react';
import _ from 'lodash';
import RichTextEditor from 'react-rte-browserify';

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
        loaded: false,
        items: [],
        formLoading: false,
        selectedIndex: 0,
        edited: false,
        errors: {},
        language: 'en',
        form: {
            title: '',
            content: RichTextEditor.createEmptyValue()
        }
    };

    componentDidMount() {
        this.retrieveEmailTemplates();
    }

    render() {
        return (
            <div className="admin-panel-email-templates">
                <Header title={i18n('EMAIL_TEMPLATES')} description={i18n('EMAIL_TEMPLATES_DESCRIPTION')} />
                {(this.state.loaded) ? this.renderContent() : this.renderLoading()}
            </div>
        );
    }

    renderContent() {
        return (
            <div className="row">
                <div className="col-md-3">
                    <Listing {...this.getListingProps()}/>
                </div>
                <div className="col-md-9">
                    <Form {...this.getFormProps()}>
                        <div className="row">
                            <div className="col-md-7">
                                <FormField label={i18n('TITLE')} name="title" validation="TITLE" required fieldProps={{size: 'large'}}/>
                            </div>
                            <div className="col-md-5">
                                <LanguageSelector type="allowed" size="medium" value={this.state.language} onChange={event => this.onItemChange(this.state.selectedIndex, event.target.value)}/>
                            </div>
                        </div>
                        <FormField label={i18n('CONTENT')} name="content" validation="TEXT_AREA" required field="textarea" />
                        <div className="admin-panel-email-templates__actions">
                            <div className="admin-panel-email-templates__save-button">
                                <SubmitButton type="secondary" size="small">{i18n('SAVE')}</SubmitButton>
                            </div>
                            <div className="admin-panel-email-templates__optional-buttons">
                                <div className="admin-panel-email-templates__discard-button">
                                    <Button onClick={this.onDiscardChangesClick.bind(this)}>{i18n('DISCARD_CHANGES')}</Button>
                                </div>
                                <div className="admin-panel-email-templates__recover-button">
                                    <Button onClick={this.onRecoverClick.bind(this)}>{i18n('RECOVER_DEFAULT')}</Button>
                                </div>
                            </div>
                        </div>
                    </Form>
                </div>
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

    getListingProps() {
        return {
            title: i18n('EMAIL_TEMPLATES'),
            items: this.getItems(),
            selectedIndex: this.state.selectedIndex,
            onChange: this.onItemChange.bind(this)
        };
    }

    getFormProps() {
        return {
            values: this.state.form,
            errors: this.state.errors,
            loading: this.state.formLoading,
            onChange: (form) => {this.setState({form, edited: true})},
            onValidateErrors: (errors) => {this.setState({errors})},
            onSubmit: this.onFormSubmit.bind(this)
        }
    }

    getItems() {
        return this.state.items.map((item) => {
            return {
                content: i18n(item.type)
            };
        });
    }

    onItemChange(index, language) {
        if(this.state.edited) {
            AreYouSure.openModal(i18n('WILL_LOSE_CHANGES'), this.updateForm.bind(this, index, language));
        } else {
            this.updateForm(index, language);
        }
    }

    onFormSubmit(form) {
        this.setState({formLoading: true});

        API.call({
            path: '/system/edit-mail-template',
            data: {
                templateType: this.state.items[this.state.selectedIndex].type,
                subject: form.title,
                body: form.content,
                language: this.state.language
            }
        }).then(() => {
            this.setState({formLoading: false});
            this.retrieveEmailTemplates();
        });
    }

    onDiscardChangesClick(event) {
        event.preventDefault();
        this.onItemChange(this.state.selectedIndex);
    }

    onRecoverClick(event) {
        event.preventDefault();
        AreYouSure.openModal(i18n('WILL_RECOVER_EMAIL_TEMPLATE'), this.recoverEmailTemplate.bind(this));
    }

    recoverEmailTemplate() {
        API.call({
            path: '/system/recover-mail-template',
            data: {
                templateType: this.state.items[this.state.selectedIndex].type,
                language: this.state.language
            }
        }).then(() => {
            this.retrieveEmailTemplates();
        });
    }

    updateForm(index, language) {
        let form = _.clone(this.state.form);
        let items = this.state.items;

        language = language || this.state.language;

        form.title = (items[index] && items[index][language].subject) || '';
        form.content = RichTextEditor.createValueFromString((items[index] && items[index][language].body) || '', 'html');

        this.setState({
            selectedIndex: index,
            language: language,
            edited: false,
            formLoading: false,
            form: form,
            errors: {}
        });
    }

    retrieveEmailTemplates() {
        return API.call({
            path: '/system/get-mail-templates',
            data: {}
        }).then((result) => this.setState({
            edited: false,
            loaded: true,
            items: this.getParsedItems(result.data)
        }, this.updateForm.bind(this, this.state.selectedIndex)));
    }

    getParsedItems(items) {
        let parsedItems = {};

        _.forEach(items, (item) => {
            if(parsedItems[item.type]) {
                parsedItems[item.type][item.language] = {
                    subject: item.subject,
                    body: item.body
                };
            } else {
                parsedItems[item.type] = {
                    [item.language]: {
                        subject: item.subject,
                        body: item.body
                    }
                };
            }
        });

        parsedItems = Object.keys(parsedItems).map((type) => {
            return _.extend({
                type: type
            }, parsedItems[type]);
        });

        return parsedItems;
    }
}

export default AdminPanelEmailTemplates;
