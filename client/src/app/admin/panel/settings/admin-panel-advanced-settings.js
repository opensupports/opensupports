import React from 'react';
import {connect}  from 'react-redux';

import ConfigActions from 'actions/config-actions';
import API from 'lib-app/api-call';
import i18n from 'lib-app/i18n';
import ToggleButton from 'app-components/toggle-button';
import AreYouSure from 'app-components/are-you-sure';

import Message from 'core-components/message';
import Button from 'core-components/button';
import FileUploader from 'core-components/file-uploader';
import Header from 'core-components/header';
import Listing from 'core-components/listing';

class AdminPanelAdvancedSettings extends React.Component {

    state = {
        loading: true,
        messageType: '',
        messageContent: '',
        keyName: '',
        keyCode: '',
        values: {
            apikeys: []
        }
    };

    componentDidMount() {
        this.getAllKeys();
    }

    render() {
        return (
            <div className="admin-panel-system-settings">
                <Header title={i18n('ADVANCED_SETTINGS')} description={i18n('ADVANCED_SETTINGS_DESCRIPTION')}/>
                {(this.state.messageType) ? this.renderMessage() : null}
                <div className="row">
                    <div className="col-md-12">
                        <div className="col-md-6">
                            <div className="admin-panel-system-settings__user-system-enabled">
                                <span className="admin-panel-system-settings__text">{i18n('ENABLE_USER_SYSTEM')}</span>
                                <ToggleButton className="admin-panel-system-settings__toggle-button" value={this.props.config['user-system-enabled']} onChange={this.onToggleButtonUserSystemChange.bind(this)}/>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="admin-panel-system-settings__registration">
                                <span className="admin-panel-system-settings__text">{i18n('ENABLE_USER_REGISTRATION')}</span>
                                <ToggleButton className="admin-panel-system-settings__toggle-button" value={this.props.config['registration']} onChange={this.onToggleButtonRegistrationChange.bind(this)}/>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <span className="separator" />
                    </div>
                    <div className="col-md-12">
                        <div className="col-md-3">
                            <div className="admin-panel-system-settings__text">{i18n('INCLUDE_USERS_VIA_CSV')}</div>
                            <FileUploader className="admin-panel-system-settings__button" text="Upload" onChange={this.onImportCSV.bind(this)}/>
                        </div>
                        <div className="col-md-3">
                            <div className="admin-panel-system-settings__text">{i18n('INCLUDE_DATABASE_VIA_SQL')}</div>
                            <FileUploader className="admin-panel-system-settings__button" text="Upload" onChange={this.onImportSQL.bind(this)}/>
                        </div>
                        <div className="col-md-3">
                            <div className="admin-panel-system-settings__text">{i18n('BACKUP_DATABASE')}</div>
                            <Button className="admin-panel-system-settings__button" type="secondary" size="medium" onClick={this.onBackupDatabase.bind(this)}>Download</Button>
                        </div>
                        <div className="col-md-3">
                            <div className="admin-panel-system-settings__text">{i18n('DELETE_ALL_USERS')}</div>
                            <Button className="admin-panel-system-settings__button" size="medium" onClick={this.onDeleteAllUsers.bind(this)}>Delete</Button>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <span className="separator" />
                    </div>
                    <div className="col-md-12 admin-panel-system-settings__api-keys">
                        <div className="col-md-12 admin-panel-system-settings__api-keys-title">{i18n('REGISTRATION_API_KEYS')}</div>
                        <div className="col-md-4">
                            <Listing {...this.getListingProps()} />
                        </div>
                        <div className="col-md-8">
                            <div className="admin-panel-system-settings__api-keys-subtitle">{i18n('NAME_OF_KEY')}</div>
                            <div></div>
                            <div className="admin-panel-system-settings__api-keys-subtitle">{i18n('KEY')}</div>
                            <div></div>
                            <Button className="admin-panel-system-settings__api-keys-button" size="medium">{i18n('DELETE')}</Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    renderMessage() {
        return (
            <Message type={this.state.messageType}>{this.state.messageContent}</Message>
        );
    }

    getListingProps() {
        return {
            title: i18n('REGISTRATION_API_KEYS'),
            enableAddNew: true,
            items: this.state.values.apikeys.map((item) => {
                return {
                    content: item.name,
                    icon: ''
                };
            })
        }
    }

    getAllKeys() {
        API.call({
            path: '/system/get-all-keys',
            data: {}
        }).then(this.onRetrieveSuccess.bind(this));
    }

    onRetrieveSuccess(result) {
        this.setState({
            values: {
                apikeys: result.data
            }
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
                messageContent: this.props.config['user-system-enabled'] ? i18n('USER_SYSTEM_DISABLED') : i18n('USER_SYSTEM_ENABLED')
            });
            this.props.dispatch(ConfigActions.updateData());
        }).catch(() => this.setState({messageType: 'error', messageContent: i18n('ERROR_UPDATING_SETTINGS')}));
    }

    onAreYouSureRegistrationOk(password) {
        API.call({
            path: this.props.config['user-system-enabled'] ? '/system/disable-registration' : '/system/enable-registration',
            data: {
                password: password
            }
        }).then(() => {
            this.setState({
                messageType: 'success',
                messageContent: this.props.config['registration'] ? i18n('REGISTRATION_DISABLED') : i18n('REGISTRATION_ENABLED')
            });
            this.props.dispatch(ConfigActions.updateData());
        }).catch(() => this.setState({messageType: 'error', messageContent: i18n('ERROR_UPDATING_SETTINGS')}));
    }

    onImportCSV(event) {
        AreYouSure.openModal(null, this.onAreYouSureCSVOk.bind(this, event.target.value), 'secure');
    }

    onImportSQL(event) {
        AreYouSure.openModal(null, this.onAreYouSureSQLOk.bind(this, event.target.value), 'secure');
    }

    onAreYouSureCSVOk(file, password) {
        API.call({
           path: '/system/import-csv',
           data: {
               file: file,
               password: password
           }
        }).then(() => this.setState({messageType: 'success', messageContent: i18n('SUCCESS_IMPORTING_CSV_DESCRIPTION')}
        )).catch(() => this.setState({messageType: 'error', messageContent: i18n('ERROR_IMPORTING_CSV_DESCRIPTION')}));
    }

    onAreYouSureSQLOk(file, password) {
        API.call({
            path: '/system/import-sql',
            data: {
                file: file,
                password: password
            }
        }).then(() => this.setState({messageType: 'success', messageContent: i18n('SUCCESS_IMPORTING_SQL_DESCRIPTION')}
        )).catch(() => this.setState({messageType: 'error', messageContent: i18n('ERROR_IMPORTING_SQL_DESCRIPTION')}));
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
        }).then(() => this.setState({messageType: 'success', messageContent: i18n('SUCCESS_DELETING_ALL_USERS')}
        )).catch(() => this.setState({messageType: 'error', messageContent: i18n('ERROR_DELETING_ALL_USERS')}));
    }
}


export default connect((store) => {
    return {
        config: store.config
    };
})(AdminPanelAdvancedSettings);
