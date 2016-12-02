import React from 'react';

import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';
import ModalContainer from 'app-components/modal-container';

import Header from 'core-components/header';
import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import SubmitButton from 'core-components/submit-button';
import Button from 'core-components/button';

class ArticleAddModal extends React.Component {
    static propTypes = {
        topicId: React.PropTypes.number.isRequired,
        topicName: React.PropTypes.string.isRequired,
        position: React.PropTypes.number.isRequired
    };

    render() {
        return (
            <div className="add-article-modal">
                <Header title={i18n('ADD_ARTICLE')} description={i18n('ADD_ARTICLE_DESCRIPTION', {category: this.props.topicName})} />
                <Form onSubmit={this.onAddNewArticleFormSubmit.bind(this)}>
                    <FormField name="title" label={i18n('TITLE')} field="input" fieldProps={{size: 'large'}} validation="TITLE" required/>
                    <FormField name="content" label={i18n('CONTENT')} field="textarea" validation="TEXT_AREA" required/>
                    <SubmitButton type="secondary">{i18n('ADD_ARTICLE')}</SubmitButton>
                    <Button className="add-article-modal__cancel-button" type="link" onClick={(event) => {
                        event.preventDefault();
                        ModalContainer.closeModal();
                    }}>{i18n('CANCEL')}</Button>
                </Form>
            </div>
        );
    }

    onAddNewArticleFormSubmit(form) {
        API.call({
            path: '/article/add',
            data: {
                title: form.title,
                content: form.content,
                topicId: this.props.topicId,
                position: this.props.position
            }
        }).then(() => {
            ModalContainer.closeModal();

            if(this.props.onChange) {
                this.props.onChange();
            }
        });
    }
}

export default ArticleAddModal;