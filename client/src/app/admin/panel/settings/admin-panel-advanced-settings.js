import React from 'react';
import {connect} from 'react-redux';

import ConfigActions from 'actions/config-actions';
import API from 'lib-app/api-call';
import i18n from 'lib-app/i18n';
import ToggleButton from 'app-components/toggle-button';
import AreYouSure from 'app-components/are-you-sure';
import ModalContainer from 'app-components/modal-container';

import Message from 'core-components/message';
import InfoTooltip from 'core-components/info-tooltip';
import Button from 'core-components/button';
import FileUploader from 'core-components/file-uploader';
import Header from 'core-components/header';
import Listing from 'core-components/listing';
import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import SubmitButton from 'core-components/submit-button';

class AdminPanelAdvancedSettings extends React.Component {

    state = {
        loading: true,
        messageTitle: null,
        messageType: '',
        messageContent: '',
        keyName: '',
        keyCode: '',
        selectedAPIKey: -1,
        APIKeys: []
    };

    componentDidMount() {
        this.getAllKeys();
    }

    render() {
        return (
            <div className="admin-panel-advanced-settings">
                <Header title={i18n('ADVANCED_SETTINGS')} description={i18n('ADVANCED_SETTINGS_DESCRIPTION')}/>
                {(this.state.messageType) ? this.renderMessage() : null}
                <div className="row">
                    <div className="col-md-12">
                        <div className="col-md-6">
                            <div className="admin-panel-advanced-settings__user-system-enabled">
                                <span className="admin-panel-advanced-settings__text">
                                    {i18n('ENABLE_USER_SYSTEM')} <InfoTooltip text={i18n('ENABLE_USER_SYSTEM_DESCRIPTION')} />
                                </span>
                                <ToggleButton className="admin-panel-advanced-settings__toggle-button" value={this.props.config['user-system-enabled']} onChange={this.onToggleButtonUserSystemChange.bind(this)}/>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="admin-panel-advanced-settings__registration">
                                <span className="admin-panel-advanced-settings__text">{i18n('ENABLE_USER_REGISTRATION')}</span>
                                <ToggleButton className="admin-panel-advanced-settings__toggle-button" value={this.props.config['registration']} onChange={this.onToggleButtonRegistrationChange.bind(this)}/>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <span className="separator" />
                    </div>
                    <div className="col-md-12">
                        <div className="col-md-4">
                            <div className="admin-panel-advanced-settings__text">
                                {i18n('INCLUDE_USERS_VIA_CSV')} <InfoTooltip text={i18n('CSV_DESCRIPTION')} />
                            </div>
                            <FileUploader className="admin-panel-advanced-settings__button" text="Upload" onChange={this.onImportCSV.bind(this)}/>
                        </div>
                        <div className="col-md-4">
                            <div className="admin-panel-advanced-settings__text">{i18n('BACKUP_DATABASE')}</div>
                            <Button className="admin-panel-advanced-settings__button" type="secondary" size="medium" onClick={this.onBackupDatabase.bind(this)}>Download</Button>
                        </div>
                        <div className="col-md-4">
                            <div className="admin-panel-advanced-settings__text">{i18n('DELETE_ALL_USERS')}</div>
                            <Button className="admin-panel-advanced-settings__button" size="medium" onClick={this.onDeleteAllUsers.bind(this)}>Delete</Button>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <span className="separator" />
                    </div>
                    <div className="col-md-12 admin-panel-advanced-settings__api-keys">
                        <div className="col-md-12 admin-panel-advanced-settings__api-keys-title">{i18n('REGISTRATION_API_KEYS')}</div>
                        <div className="col-md-4">
                            <Listing {...this.getListingProps()} />
                        </div>
                        <div className="col-md-8">
                            {(this.state.selectedAPIKey === -1) ? this.renderNoKey() : this.renderKey()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    renderMessage() {
        return (
            <Message type={this.state.messageType} title={this.state.messageTitle}>{this.state.messageContent}</Message>
        );
    }

    renderNoKey() {
        return (
            <div className="admin-panel-advanced-settings__api-keys-none">
                {i18n('NO_KEY_SELECTED')}
            </div>
        );
    }

    renderKey() {
        let currentAPIKey = this.state.APIKeys[this.state.selectedAPIKey];

        return (
            <div className="admin-panel-advanced-settings__api-keys-info">
                <div className="admin-panel-advanced-settings__api-keys-subtitle">{i18n('NAME_OF_KEY')}</div>
                <div className="admin-panel-advanced-settings__api-keys-data">{currentAPIKey.name}</div>
                <div className="admin-panel-advanced-settings__api-keys-subtitle">{i18n('KEY')}</div>
                <div className="admin-panel-advanced-settings__api-keys-data">{currentAPIKey.token}</div>
                <Button className="admin-panel-advanced-settings__api-keys-button" size="medium" onClick={this.onDeleteKeyClick.bind(this)}>
                    {i18n('DELETE')}
                </Button>
            </div>
        );
    }

    getListingProps() {
        return {
            title: i18n('REGISTRATION_API_KEYS'),
            enableAddNew: true,
            items: this.state.APIKeys.map((item) => {
                return {
                    content: item.name,
                    icon: ''
                };
            }),
            selectedIndex: this.state.selectedAPIKey,
            onChange: index => this.setState({selectedAPIKey: index}),
            onAddClick: this.openAPIKeyModal.bind(this)
        };
    }

    openAPIKeyModal() {
        ModalContainer.openModal(
            <Form className="admin-panel-advanced-settings__api-keys-modal" onSubmit={this.addAPIKey.bind(this)}>
                <Header title={i18n('ADD_API_KEY')} description={i18n('ADD_API_KEY_DESCRIPTION')}/>
                <FormField name="name" label={i18n('NAME_OF_KEY')} validation="DEFAULT" required fieldProps={{size: 'large'}}/>
                <SubmitButton type="secondary">{i18n('SUBMIT')}</SubmitButton>
            </Form>
        );
    }

    addAPIKey({name}) {
        ModalContainer.closeModal();
        API.call({
            path: '/system/add-api-key',
            data: {name, type: 'REGISTRATION'}
        }).then(this.getAllKeys.bind(this));
    }

    getAllKeys() {
        API.call({
            path: '/system/get-api-keys',
            data: {}
        }).then(this.onRetrieveSuccess.bind(this));
    }

    onDeleteKeyClick() {
        AreYouSure.openModal(null, () => {
            API.call({
                path: '/system/delete-api-key',
                data: {
                    name: this.state.APIKeys[this.state.selectedAPIKey].name
                }
            }).then(this.getAllKeys.bind(this));
        });
    }

    onRetrieveSuccess(result) {
        this.setState({
            APIKeys: result.data.filter(key => key['type'] === 'REGISTRATION'),
            selectedAPIKey: -1
        });
    }

    onToggleButtonUserSystemChange() {
        AreYouSure.openModal(null, this.onAreYouSureUserSystemOk.bind(this), 'secure');
    }

    onToggleButtonRegistrationChange() {
        AreYouSure.openModal(null, this.onAreYouSureRegistrationOk.bind(this), 'secure');
    }

    onAreYouSureUserSystemOk(password) {
        API.call({
            path: this.props.config['user-system-enabled'] ? '/system/disable-user-system' : '/system/enable-user-system',
            data: {
                password: password
            }
        }).then(() => {
            this.setState({
                messageType: 'success',
                messageTitle: null,
                messageContent: this.props.config['user-system-enabled'] ? i18n('USER_SYSTEM_DISABLED') : i18n('USER_SYSTEM_ENABLED')
            });
            this.props.dispatch(ConfigActions.updateData());
        }).catch(() => this.setState({messageType: 'error', messageTitle: null, messageContent: i18n('ERROR_UPDATING_SETTINGS')}));
    }

    onAreYouSureRegistrationOk(password) {
        API.call({
            path: this.props.config['registration'] ? '/system/disable-registration' : '/system/enable-registration',
            data: {
                password: password
            }
        }).then(() => {
            this.setState({
                messageType: 'success',
                messageTitle: null,
                messageContent: this.props.config['registration'] ? i18n('REGISTRATION_DISABLED') : i18n('REGISTRATION_ENABLED')
            });
            this.props.dispatch(ConfigActions.updateData());
        }).catch(() => this.setState({messageType: 'error', messageTitle: null, messageContent: i18n('ERROR_UPDATING_SETTINGS')}));
    }

    onImportCSV(event) {
        AreYouSure.openModal(null, this.onAreYouSureCSVOk.bind(this, event.target.value), 'secure');
    }

    onAreYouSureCSVOk(file, password) {
        API.call({
            path: '/system/csv-import',
            dataAsForm: true,
            data: {
                file: file,
                password: password
            }
        })
        .then((result) => this.setState({
            messageType: 'success', 
            messageTitle: i18n('SUCCESS_IMPORTING_CSV_DESCRIPTION'),
            messageContent: (result.data.length) ? (
                <div>
                    {i18n('ERRORS_FOUND')}
                    <ul>
                        {result.data.map((error) => <li>{error}</li>)}
                    </ul>
                </div>
            ) : null
        }))
        .catch(() => this.setState({messageType: 'error', messageTitle: null, messageContent: i18n('INVALID_FILE')}));
    }

    onBackupDatabase() {
        API.call({
            path: '/system/backup-database',
            plain: true,
            data: {}
        }).then((result) => {
            let contentType = 'application/octet-stream';
            let link = document.createElement('a');
            let blob = new Blob([result], {'type': contentType});
            link.href = window.URL.createObjectURL(blob);
            link.download = 'backup.sql';
            link.click();
        });
    }

    onDeleteAllUsers() {
        AreYouSure.openModal(null, this.onAreYouSureDeleteAllUsersOk.bind(this), 'secure');
    }

    onAreYouSureDeleteAllUsersOk(password) {
        API.call({
            path: '/system/delete-all-users',
            data: {
                password: password
            }
        }).then(() => this.setState({messageType: 'success', messageTitle: null, messageContent: i18n('SUCCESS_DELETING_ALL_USERS')}
        )).catch(() => this.setState({messageType: 'error', messageTitle: null, messageContent: i18n('ERROR_DELETING_ALL_USERS')}));
    }
}


export default connect((store) => {
    return {
        config: store.config
    };
})(AdminPanelAdvancedSettings);
