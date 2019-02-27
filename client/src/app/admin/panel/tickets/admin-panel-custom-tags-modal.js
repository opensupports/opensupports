import React from 'react';

import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';

import Button from 'core-components/button';
import Header from 'core-components/header';
import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import SubmitButton from 'core-components/submit-button';
import ColorSelector from 'core-components/color-selector';

class AdminPanelCustomTagsModal extends React.Component {
    static contextTypes = {
        closeModal: React.PropTypes.func
    };

    static propTypes = {
        defaultValues: React.PropTypes.object,
        onTagCreated: React.PropTypes.func
    };

    state = {
        form: this.props.defaultValues || {name: '', color: '#ff6900'},
        loading: false
    };

    render() {
        return (
            <div>
                <Header title={'new tags'} description={i18n('Here you can add a topic that works as a category for articles.')} />
                <Form
                    values={this.state.form}
                    onChange={this.onFormChange.bind(this)}
                    onSubmit={this.onSubmitTag.bind(this)}
                    errors={this.state.errors}
                    onValidateErrors={errors => this.setState({errors})}
                    loading={this.state.loading}>
                    <FormField name="name" label={i18n('NAME')} fieldProps={{size: 'large'}} required />
                    <FormField name="color" label={i18n('COLOR')} decorator={ColorSelector} />

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

    onFormChange(form) {
        this.setState({
            form
        });
    }

    onSubmitTag(form) {
        this.setState({
            loading: true
        });

        API.call({
            path: '/ticket/create-tag',
            data: {
                name: form.name,
                color: form.color,
            }
        }).then(() => {
            this.context.closeModal();
            this.setState({
                loading: false,
                errors: {}
            });

            if(this.props.onTagCreated) {
                this.props.onTagCreated();
            }

        }).catch((result) => {

            this.setState({
                loading: false,
                errors: {
                    'name': result.message
                }
            });

        });
    }

    onDiscardClick(event) {
        event.preventDefault();
        this.context.closeModal();
        this.setState({
            loading: false,
            errors: {}
        });
    }
}

export default AdminPanelCustomTagsModal;
