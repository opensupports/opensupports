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
import InfoTooltip from 'core-components/info-tooltip';

class TopicEditModal extends React.Component {

    static contextTypes = {
        closeModal: React.PropTypes.func
    };

    static propTypes = {
        defaultValues: React.PropTypes.object,
        addForm: React.PropTypes.bool,
        topicId: React.PropTypes.number
    };

    state = {
        values: this.props.defaultValues || {title: '', icon: 'address-card', color: '#ff6900', private: false},
        loading: false
    };

    render() {
        return (
            <div className="topic-edit-modal">
                <Header title={i18n((this.props.addForm) ? 'ADD_TOPIC' : 'EDIT_TOPIC')} description={i18n((this.props.addForm) ? 'ADD_TOPIC_DESCRIPTION' : 'EDIT_TOPIC_DESCRIPTION')} />
                <Form values={this.state.values} onChange={this.onFormChange.bind(this)} onSubmit={this.onSubmit.bind(this)} loading={this.state.loading}>
                    <FormField name="title" label={i18n('TITLE')} fieldProps={{size: 'large'}} validation="TITLE" required />
                    <FormField name="icon" className="topic-edit-modal__icon" label={i18n('ICON')} decorator={IconSelector} />
                    <FormField name="color" className="topic-edit-modal__color" label={i18n('COLOR')} decorator={ColorSelector} />
                    <FormField className="topic-edit-modal__private" label={i18n('PRIVATE')} name="private" field="checkbox" />
                    <InfoTooltip className="topic-edit-modal__private"  text={i18n('PRIVATE_TOPIC_DESCRIPTION')} />
                    <div className="topic-edit-modal__buttons-container">
                        <Button className="topic-edit-modal__discard-button" onClick={this.onDiscardClick.bind(this)} size="small">
                            {i18n('CANCEL')}
                        </Button>
                        <SubmitButton className="topic-edit-modal__save-button" type="secondary" size="small">
                            {i18n('SAVE')}
                        </SubmitButton>
                    </div>
                </Form>
            </div>
        );
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

    onFormChange(form) {
        this.setState({
            values: form
        });
    }

    onDiscardClick(event) {
        event.preventDefault();
        this.context.closeModal();
    }
}

export default TopicEditModal;
