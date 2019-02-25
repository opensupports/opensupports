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
import ModalContainer from 'app-components/modal-container';
import ColorSelector from 'core-components/color-selector';
class TagList extends React.Component {
    constructor(props) {
        super(props);

        const list = this.props.tags.map((tag) => {
            <h1>{tag.name}</h1>;
        })
    }
    render() {
        return (
            <div>
                {list}
            </div>
        );
    }
}
class AdminPanelCustomTags extends React.Component {
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
        },
        tagList: {}  //
    };

    componentDidMount() {
        if (!this.props.loaded) {
            this.retrieveCustomResponses();
        }
    }

    render() {
        return (
            <div className="admin-panel-custom-tags">
                <Header title={i18n('CUSTOM_TAGS')} description={i18n('CUSTOM_TAGS_DESCRIPTION')} />
                {(this.props.loaded) ? this.renderContent() : this.renderLoading()}
            </div>
        );
    }

    renderContent() {
        return (
            <div className="row">
                <div className="col-md-3">
                <Button onClick={this.onCreateTag.bind(this)} type="secondary" ><Icon name="pencil"/>'NUEVO TAGi18n'</Button>
                <TagList tags={this.state.tagList}/>
                </div>
            </div>
        );
    }
    onCreateTag() {
        ModalContainer.openModal(
            <div>
            <Header title={'new tags'} description={i18n('Here you can add a topic that works as a category for articles.')} />
            <Form values={this.state.values} onChange={this.onFormChange.bind(this)} onSubmit={this.onSubmitTag.bind(this)} loading={this.state.loading}>
                <FormField name="title" label={i18n('TITLE')} fieldProps={{size: 'large'}} validation="TITLE" required />
                <FormField name="color" className="topic-edit-modal__color" label={i18n('COLOR')} decorator={ColorSelector} />
                <FormField className="topic-edit-modal__private" label={i18n('PRIVATE')} name="private" field="checkbox"/>

                <SubmitButton className="topic-edit-modal__save-button" type="secondary" size="small">
                    {i18n('SAVE')}
                </SubmitButton>
                <Button className="topic-edit-modal__discard-button" onClick={this.onDiscardClick.bind(this)} size="small">
                    {i18n('CANCEL')}
                </Button>
            </Form>
            </div>
        );
    }
    onSubmitTag() {
        API.call({
            path: '/ticket/add-tag',
            data: {
                name: form.title,
                color: form.content,
            }
        }).then(() => {
            this.context.closeModal();
            this.updateTagList();

            if(this.props.onChange) {
                this.props.onChange();
            }
        }).catch(() => {
            this.setState({
              loading: false
            });
        });
    }
    onFormChange(form) {
        this.setState({
            values: form
        });
    }
    onDiscardClick(event) {
        event.preventDefault();
        this.context.closeModal();
    }
    renderLoading() {
        return (
            <div className="admin-panel-custom-responses__loading">
                <Loading backgrounded size="large"/>
            </div>
        );
    }

    renderOptionalButtons() {
        return (
            <div className="admin-panel-custom-responses__optional-buttons">
                <div className="admin-panel-custom-responses__discard-button">
                    {this.isEdited() ? <Button onClick={this.onDiscardChangesClick.bind(this)}>{i18n('DISCARD_CHANGES')}</Button> : null}
                </div>
                <div className="admin-panel-custom-responses__delete-button">
                    <Button onClick={this.onDeleteClick.bind(this)}>{i18n('DELETE')}</Button>
                </div>
            </div>
        );
    }

    onItemChange(index) {
        if(this.isEdited()) {
            AreYouSure.openModal(i18n('WILL_LOSE_CHANGES'), this.updateForm.bind(this, index));
        } else {
            this.updateForm(index);
        }
    }

    onSubmit() {
        this.setState({
          loading: true
        });

        API.call({
            path: (this.props.addForm) ? '/article/add-topic' : '/article/edit-topic',
            data: {
                topicId: this.props.topicId,
                name: this.state.values['title'],
                icon: this.state.values['icon'],
                iconColor: this.state.values['color'],
                private: this.state.values['private']*1
            }
        }).then(() => {
            this.context.closeModal();

            if(this.props.onChange) {
                this.props.onChange();
            }
        }).catch(() => {
            this.setState({
              loading: false
            });
        });
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
        API.call({
            path: '/ticket/delete-custom-response',
            data: {
                id: this.props.items[this.state.selectedIndex].id
            }
        }).then(() => {
            this.retrieveCustomResponses();
            this.onItemChange(-1);
        });
    }
    updateTagList() {
        API.call({
            path: '/ticket/get-tags'
        }).then(() => {
            this.setState({
                tagList: data
            });
        });
    }

    updateForm(index) {
        let form = _.clone(this.state.form);

        form.title = (this.props.items[index] && this.props.items[index].name) || '';
        form.content = TextEditor.getEditorStateFromHTML((this.props.items[index] && this.props.items[index].content) || '');
        form.language = (this.props.items[index] && this.props.items[index].language) || this.props.language;

        this.setState({
            formClicked: false,
            showForm: true,
            selectedIndex: index,
            formLoading: false,
            originalForm: form,
            form: form,
            errors: {}
        });
    }

    retrieveCustomResponses() {
        this.props.dispatch(AdminDataActions.retrieveCustomResponses());
    }

    isEdited() {
        return this.state.form.title && this.state.formClicked && (
            this.state.form.title != this.state.originalForm.title ||
            this.state.form.content != this.state.originalForm.content ||
            this.state.form.language != this.state.originalForm.language
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
})(AdminPanelCustomTags);
