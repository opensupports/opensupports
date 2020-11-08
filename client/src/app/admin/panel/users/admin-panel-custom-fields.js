import React from 'react';
import _ from 'lodash';

import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';

import AdminPanelCustomFieldForm from 'app/admin/panel/users/admin-panel-custom-field-form';
import ModalContainer from 'app-components/modal-container';
import AreYouSure from 'app-components/are-you-sure';

import Header from 'core-components/header';
import Button from 'core-components/button';
import Icon from 'core-components/icon';
import InfoTooltip from 'core-components/info-tooltip';
import Table from 'core-components/table';

class AdminPanelCustomFields extends React.Component {

    state = {
        customFields: [],
    };

    componentDidMount() {
        this.retrieveCustomFields();
    }

    render() {
        return (
            <div className="admin-panel-custom-fields">
                <Header title={i18n('CUSTOM_FIELDS')} description={i18n('CUSTOM_FIELDS_DESCRIPTION')} />
                {this.renderCustomFieldList()}
                <div className="admin-panel-custom-fields__container-button">
                    <Button className="admin-panel-custom-fields__container-button__add-button" type="secondary" onClick={this.onNewCustomFieldClick.bind(this)}>
                        <Icon name="plus" /> {i18n('NEW_CUSTOM_FIELD')}
                    </Button>
                </div>
            </div>
        );
    }

    renderCustomFieldList() {
        return (
            <Table
                className="admin-panel-custom-fields__list"
                headers={[
                    {key: 'name', value: i18n('NAME')},
                    {key: 'type', value: i18n('TYPE')},
                    {key: 'options', value: i18n('OPTIONS')},
                    {key: 'actions', value: ''},
                ]}
                rows={this.state.customFields.map(this.getCustomField.bind(this))} />
        );
    }

    getCustomField(customField, index) {
        const {id, description, name, type, options} = customField;
        let descriptionInfoTooltip = null;

        if(description) {
            descriptionInfoTooltip = <InfoTooltip text={description} />;
        }

        return {
            name: <div>{name} {descriptionInfoTooltip}</div>,
            type,
            options: JSON.stringify(options.map(option => option.name)),
            actions: <Button size="medium" onClick={this.onDeleteCustomField.bind(this, id)}>Remove</Button>,
        }
    }

    onNewCustomFieldClick() {
        ModalContainer.openModal(
            <AdminPanelCustomFieldForm
                onClose={(e) => {e.preventDefault(); ModalContainer.closeModal();}}
                onChange={() => {
                    this.retrieveCustomFields();
                    ModalContainer.closeModal();
                }} />
        );
    }

    onDeleteCustomField(id) {
        AreYouSure.openModal(i18n('DELETE_CUSTOM_FIELD_SURE'), this.deleteCustomField.bind(this, id));
    }

    deleteCustomField(id) {
        return API.call({
            path: '/system/delete-custom-field',
            data: {id}
        })
        .catch(() => this.setState({}))
        .then(() => this.retrieveCustomFields());
    }

    retrieveCustomFields() {
        API.call({
            path: '/system/get-custom-fields',
            data: {}
        })
        .catch(() => this.setState({}))
        .then(result => this.setState({
            customFields: result.data
        }));
    }
}

export default AdminPanelCustomFields;
