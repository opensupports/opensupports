import React from 'react';

import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';

import Header from 'core-components/header';
import Button from 'core-components/button';
import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import SubmitButton from 'core-components/submit-button';
import IconSelector from 'core-components/icon-selector';
import ColorSelector from 'core-components/color-selector';

class TopicEditModal extends React.Component {

    static contextTypes = {
        closeModal: React.PropTypes.func
    };

    static propTypes = {
        defaultValues: React.PropTypes.object,
        topicId: React.PropTypes.number
    };

    state = {
        values: this.props.defaultValues
    };

    render() {
        return (
            <div className="topic-edit-modal">
                <Header title={i18n('EDIT_TOPIC')} description={i18n('EDIT_TOPIC_DESCRIPTION')} />
                <Form values={this.state.values} onChange={this.onFormChange.bind(this)} onSubmit={this.onSubmit.bind(this)}>
                    <FormField name="title" label={i18n('TITLE')} />
                    <FormField name="icon" label={i18n('ICON')} decorator={IconSelector} />
                    <FormField name="color" label={i18n('COLOR')} decorator={ColorSelector} />

                    <SubmitButton type="secondary" size="small">
                        {i18n('SAVE')}
                    </SubmitButton>
                    <Button onDiscardClick={this.onDiscardClick.bind(this)}>{i18n('DISCARD_CHANGES')}</Button>
                </Form>
            </div>
        );
    }

    onSubmit() {
        API.call({
            path: '/article/edit-topic',
            data: {
                topicId: this.props.topicId,
                name: this.state.values['name'],
                icon: this.state.values['icon'],
                iconColor: this.state.values['color']
            }
        }).then(this.context.closeModal);
    }

    onFormChange(form) {
        this.setState({
            values: form
        });
    }

    onDiscardClick() {
        this.setState({
            values: this.props.defaultValues
        }, this.context.closeModal);
    }
}

export default TopicEditModal;