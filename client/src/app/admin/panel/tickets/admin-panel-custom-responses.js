import React from 'react';
import _ from 'lodash';
import {connect}  from 'react-redux';

import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';
import AdminDataActions from 'actions/admin-data-actions';

import AreYouSure from 'app-components/are-you-sure';
import LanguageSelector from 'app-components/language-selector';

import Icon from 'core-components/icon';
import Button from 'core-components/button';
import Header from 'core-components/header';
import Listing from 'core-components/listing';
import Loading from 'core-components/loading';
import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import SubmitButton from 'core-components/submit-button';
import TextEditor from 'core-components/text-editor';

class AdminPanelCustomResponses extends React.Component {
    static defaultProps = {
        items: [],
    };

    state = {
        formClicked: false,
        showForm: false,
        formLoading: false,
        selectedIndex: -1,
        errors: {},
        originalForm: {
            title: '',
            content: TextEditor.createEmpty(),
            language: this.props.language
        },
        form: {
            title: '',
            content: TextEditor.createEmpty(),
            language: this.props.language
        }
    };

    componentDidMount() {
        if (!this.props.loaded) {
            this.retrieveCustomResponses();
        }
    }

    render() {
        return (
            <div className="admin-panel-custom-responses">
                <Header title={i18n('CUSTOM_RESPONSES')} description={i18n('CUSTOM_RESPONSES_DESCRIPTION')} />
                {(this.props.loaded) ? this.renderContent() : this.renderLoading()}
            </div>
        );
    }

    renderContent() {
        return (
            <div className="row">
                <div className="col-md-3">
                    <Listing {...this.getListingProps()} />
                </div>
                {this.state.showForm ?  this.renderForm() : null}
            </div>
        );
    }

    renderLoading() {
        return (
            <div className="admin-panel-custom-responses__loading">
                <Loading backgrounded size="large" />
            </div>
        );
    }

    renderForm() {
        return (
            <div className="col-md-9">
                <Form {...this.getFormProps()}>
                    <div className="row">
                        <div className="col-md-7">
                            <FormField label={i18n('TITLE')} name="title" validation="TITLE" required fieldProps={{size: 'large'}} />
                        </div>
                        <div className="col-md-5">
                            <FormField label={i18n('LANGUAGE')} name="language" field="input" decorator={LanguageSelector} fieldProps={{size: 'medium'}} />
                        </div>
                    </div>
                    <FormField label={i18n('CONTENT')} name="content" validation="TEXT_AREA" required field="textarea" />
                    <div className="admin-panel-custom-responses__actions">
                        {(this.state.selectedIndex !== -1) ? this.renderOptionalButtons() : null}
                        <div className="admin-panel-custom-responses__save-button">
                            <SubmitButton type="secondary" size="small">{i18n('SAVE')}</SubmitButton>
                        </div>
                    </div>
                </Form>
            </div>
        );
    }

    renderOptionalButtons() {
        return (
            <div className="admin-panel-custom-responses__optional-buttons">
                <div className="admin-panel-custom-responses__delete-button">
                    <Button onClick={this.onDeleteClick.bind(this)}>{i18n('DELETE')}</Button>
                </div>
                <div className="admin-panel-custom-responses__discard-button">
                    {this.isEdited() ? <Button onClick={this.onDiscardChangesClick.bind(this)}>{i18n('DISCARD_CHANGES')}</Button> : null}
                </div>
            </div>
        );
    }

    getListingProps() {
        return {
            title: i18n('CUSTOM_RESPONSES'),
            items: this.getItems(),
            selectedIndex: this.state.selectedIndex,
            enableAddNew: true,
            onChange: this.onItemChange.bind(this),
            onAddClick: this.onItemChange.bind(this, -1)
        };
    }

    getFormProps() {
        const { form, errors, formLoading } = this.state;

        return {
            values: form,
            errors,
            loading: formLoading,
            onClick: () => this.setState({formClicked: true}),
            onChange: (form) => this.setState({form}),
            onValidateErrors: (errors) => {this.setState({errors})},
            onSubmit: this.onFormSubmit.bind(this)
        }
    }

    getItems() {
        return this.props.items.map((item) => {
            return {
                content: (
                    <span>
                        {item.name}
                        <span className="admin-panel-custom-responses__item-flag">
                            <Icon name={(item.language != 'en') ? item.language : 'us'} />
                        </span>
                    </span>
                )
            };
        });
    }

    onItemChange(index) {
        if(this.isEdited()) {
            AreYouSure.openModal(i18n('WILL_LOSE_CHANGES'), this.updateForm.bind(this, index));
        } else {
            this.updateForm(index);
        }
    }

    onFormSubmit(form) {
        const {items, allowedLanguages} = this.props;
        const { selectedIndex } = this.state;

        this.setState({formLoading: true});

        if(selectedIndex !== -1) {
            API.call({
                path: '/ticket/edit-custom-response',
                data: {
                    id: items[selectedIndex].id,
                    name: form.title,
                    content: form.content,
                    language: _.includes(allowedLanguages, form.language) ? form.language : allowedLanguages[0]
                }
            }).then(() => {
                this.setState({formLoading: false, originalForm: form});
                this.retrieveCustomResponses();
            }).catch(this.onItemChange.bind(this, -1));
        } else {
            this.setState({form, originalForm: form});
            API.call({
                path: '/ticket/add-custom-response',
                data: {
                    name: form.title,
                    content: form.content,
                    language: _.includes(allowedLanguages, form.language) ? form.language : allowedLanguages[0]
                }
            }).then(() => {
                this.retrieveCustomResponses();
                this.onItemChange(-1);
            }).catch(this.onItemChange.bind(this, -1));
        }
    }

    onDiscardChangesClick(event) {
        event.preventDefault();
        this.onItemChange(this.state.selectedIndex);
    }

    onDeleteClick(event) {
        event.preventDefault();
        AreYouSure.openModal(i18n('WILL_DELETE_CUSTOM_RESPONSE'), this.deleteCustomResponse.bind(this));
    }

    deleteCustomResponse() {
        this.updateForm(this.state.selectedIndex)

        return API.call({
            path: '/ticket/delete-custom-response',
            data: {
                id: this.props.items[this.state.selectedIndex].id
            }
        }).then(() => {
            this.retrieveCustomResponses();
            this.onItemChange(-1);
        });
    }

    updateForm(index) {
        const { items, language } = this.props;
        const item = items[index];

        let form = _.clone(this.state.form);

        form.title = (item && item.name) || '';
        form.content = TextEditor.getEditorStateFromHTML((item && item.content) || '');
        form.language = (item && item.language) || language;

        this.setState({
            formClicked: false,
            showForm: true,
            selectedIndex: index,
            formLoading: false,
            originalForm: form,
            form,
            errors: {}
        });
    }

    retrieveCustomResponses() {
        this.props.dispatch(AdminDataActions.retrieveCustomResponses());
    }

    isEdited() {
        const { form, formClicked, originalForm } = this.state;

        return (
            form.title && formClicked && (
                form.title != originalForm.title ||
                form.content != originalForm.content ||
                form.language != originalForm.language
            )
        );
    }
}

export default connect((store) => {
    return {
        allowedLanguages: store.config.allowedLanguages,
        language: store.config.language,
        loaded: store.adminData.customResponsesLoaded,
        items: store.adminData.customResponses
    };
})(AdminPanelCustomResponses);
