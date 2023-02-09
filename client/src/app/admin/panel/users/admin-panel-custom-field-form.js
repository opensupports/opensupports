import React from 'react';
import _ from 'lodash';

import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';

import Header from 'core-components/header';
import Button from 'core-components/button';
import SubmitButton from 'core-components/submit-button';
import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import Message from 'core-components/message';

class AdminPanelCustomFieldForm extends React.Component {

    static propTypes = {
        onClose: React.PropTypes.func,
        onChange: React.PropTypes.func,
    };

    state = {
        loading: false,
        error: null,
        addForm: {
            name: "",
            description: ""
        },
        addFormOptions: [],
        showErrorMessage: true
    };

    render() {
        const { loading, addForm, error } = this.state;

        return (
            <div className="admin-panel-custom-field-form">
                <Header title={i18n('NEW_CUSTOM_FIELD')} description={i18n('NEW_CUSTOM_FIELD_DESCRIPTION')} />
                <div className="admin-panel-custom-field-form__form-container">
                    <Form
                        className="admin-panel-custom-field-form__form"
                        loading={loading}
                        values={addForm}
                        onChange={this.onAddFormChange.bind(this)}
                        onSubmit={this.onSubmit.bind(this)}
                        onKeyDown={(event) => { if(event.key == 'Enter') event.preventDefault()}}>
                        <FormField name="name" validation="NAME" label={i18n('NAME')} field="input" fieldProps={{size: 'large'}} required/>
                        <FormField name="description" label={i18n('FIELD_DESCRIPTION')} field="input" fieldProps={{size: 'large'}}/>
                        <FormField name="type" label={i18n('TYPE')} field="select" fieldProps={{size: 'large', items: [{content: i18n('TEXT_INPUT')}, {content: i18n('SELECT_INPUT')}]}} required/>
                        {addForm.type ? this.renderOptionFormFields() : null}
                        {error ? this.renderErrorMessage() : null}
                        <div className="admin-panel-custom-field-form__buttons">
                            <Button onClick={this.props.onClose} type="link">{i18n('CLOSE')}</Button>
                            <SubmitButton type="secondary">{i18n('SUBMIT')}</SubmitButton>
                        </div>
                    </Form>
                </div>
            </div>
        );
    }

    renderErrorMessage() {
        const { error, showErrorMessage } = this.state;

        return (
            <Message showMessage={showErrorMessage} onCloseMessage={this.onCloseMessage.bind(this, "showErrorMessage")} type="error">
                {i18n(error)}
            </Message>
        );
    }

    renderOptionFormFields() {
        return (
            <div className="admin-panel-custom-field-form__options">
                <div className="admin-panel-custom-field-form__options-title">{i18n('OPTIONS')}</div>
                {this.state.addFormOptions.map(this.renderFormOption.bind(this))}
                <Button className="admin-panel-custom-field-form__option-add-button" iconName="plus" size="medium" type="secondary" onClick={this.onAddOptionClick.bind(this)} />
            </div>
        );
    }

    renderFormOption(option, index) {
        return (
            <div key={index} className="admin-panel-custom-field-form__option">
                <FormField className="admin-panel-custom-field-form__option-field" name={`option_${index}`} label={i18n('OPTION', {index: index+1})} type="input"/>
                <Button className="admin-panel-custom-field-form__option-delete-button" size="medium" iconName="times" onClick={this.onDeleteOptionClick.bind(this, index)}/>
            </div>
        );
    }

    onCloseMessage(showMessage) {
        this.setState({
            [showMessage]: false
        });
    }

    onAddOptionClick(event) {
        event.preventDefault();
        let addFormOptions = _.clone(this.state.addFormOptions);

        addFormOptions.push("");

        this.setState({ addFormOptions });
    }

    onDeleteOptionClick(index, event) {
        event.preventDefault();

        let addForm = _.clone(this.state.addForm);
        let addFormOptions = this.state.addFormOptions.filter((option, idx) => idx != index);

        Object.keys(addForm).forEach(key => _.includes(key, 'option_') ? delete addForm[key] : null);
        addFormOptions.forEach((option, _index) => addForm[`option_${_index}`] = option);

        this.setState({addForm, addFormOptions});
    }

    onAddFormChange(addForm) {
        const addFormOptions = this.state.addFormOptions.map((option, index) => addForm[`option_${index}`]);

        this.setState({addForm, addFormOptions});
    }

    onSubmit(form) {
        this.setState({loading: true, message: null});
        API.call({
            path: '/system/add-custom-field',
            data: {
                name: form.name,
                description: form.description,
                type: form.type ? 'select' : 'text',
                options: form.type ? JSON.stringify(this.state.addFormOptions) : []
            }
        })
        .then(() => {
            this.setState({loading: false, message: null});
            if(this.props.onChange) this.props.onChange();
        })
        .catch(result => this.setState({loading: false, error: result.message, showErrorMessage: true}));
    }
}

export default AdminPanelCustomFieldForm;
