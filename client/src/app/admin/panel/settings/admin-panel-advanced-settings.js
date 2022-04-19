import React from 'react';
import {connect} from 'react-redux';

import ConfigActions from 'actions/config-actions';
import API from 'lib-app/api-call';
import i18n from 'lib-app/i18n';
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
import Checkbox from 'core-components/checkbox';

class AdminPanelAdvancedSettings extends React.Component {

    state = {
        loading: true,
        messageTitle: null,
        messageType: '',
        messageContent: '',
        selectedAPIKey: -1,
        APIKeys: [],
        error: '',
        showMessage: true,
        showAPIKeyMessage: true
    };

    componentDidMount() {
        this.getAllKeys();
    }

    render() {
        const { config } = this.props;
        const { messageType, error, selectedAPIKey, showAPIKeyMessage } = this.state;

        return (
            <div className="admin-panel-advanced-settings">
                <Header title={i18n('ADVANCED_SETTINGS')} description={i18n('ADVANCED_SETTINGS_DESCRIPTION')} />
                {messageType ? this.renderMessage() : null}
                <div className="row">
                    <div className="col-md-12">
                        <div className="col-md-6 admin-panel-advanced-settings__mandatory-login">
                            <Checkbox
                                label={i18n('ENABLE_MANDATORY_LOGIN')}
                                disabled={!config['registration']}
                                className="admin-panel-advanced-settings__mandatory-login__checkbox"
                                value={config['mandatory-login']}
                                onChange={this.onCheckboxMandatoryLoginChange.bind(this)}
                                wrapInLabel />
                        </div>
                        <div className="col-md-6">
                            <div className="admin-panel-advanced-settings__registration">
                                <Checkbox
                                    label={i18n('ENABLE_USER_REGISTRATION')}
                                    disabled={!config['mandatory-login']}
                                    className="admin-panel-advanced-settings__registration__checkbox"
                                    value={config['registration']}
                                    onChange={this.onCheckboxRegistrationChange.bind(this)}
                                    wrapInLabel />
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
                            <FileUploader className="admin-panel-advanced-settings__button" text="Upload" onChange={this.onImportCSV.bind(this)} />
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
                        <div className="col-md-12 admin-panel-advanced-settings__api-keys-title">{i18n('API_KEYS')}</div>
                        <div className="col-md-4">
                            <Listing {...this.getListingProps()} />
                        </div>
                        <div className="col-md-8 admin-panel-advanced-settings__api-keys__container">
                            {
                                error ?
                                    <Message
                                        showMessage={showAPIKeyMessage}
                                        onCloseMessage={this.onCloseMessage.bind(this, "showAPIKeyMessage")}
                                        type="error">
                                            {i18n(error)}
                                    </Message> :
                                    ((selectedAPIKey === -1) ? this.renderNoKey() : this.renderKey())
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    renderMessage() {
        const { messageType, messageTitle, messageContent, showMessage } = this.state;

        return (
            <Message
                showMessage={showMessage}
                onCloseMessage={this.onCloseMessage.bind(this, "showMessage")}
                className="admin-panel-advanced-settings__message"
                type={messageType}
                title={messageTitle}>
                    {messageContent}
            </Message>
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
        const { APIKeys, selectedAPIKey } = this.state;
        const {
            name,
            token,
            canCreateTickets,
            shouldReturnTicketNumber,
            canCheckTickets,
            canCreateUser
        } = APIKeys[selectedAPIKey];

        return (
            <div className="admin-panel-advanced-settings__api-keys__container-info">
                <div className="admin-panel-advanced-settings__api-keys-subtitle">{i18n('NAME_OF_KEY')}</div>
                <div className="admin-panel-advanced-settings__api-keys-data">{name}</div>
                <div className="admin-panel-advanced-settings__api-keys-subtitle">{i18n('KEY')}</div>
                <div className="admin-panel-advanced-settings__api-keys-data">{token}</div>
                <div className="admin-panel-advanced-settings__api-keys-subtitle">{i18n('PERMISSIONS')}</div>
                <div className="admin-panel-advanced-settings__api-keys__permissions">
                    <FormField className="admin-panel-advanced-settings__api-keys__permissions__item" value={canCreateTickets*1} label={i18n('TICKET_CREATION_PERMISSION')} field='checkbox' />
                    <FormField value={shouldReturnTicketNumber*1} label={i18n('TICKET_NUMBER_RETURN_PERMISSION')} field='checkbox' />
                </div>
                <div className="admin-panel-advanced-settings__api-keys__permissions">
                    <FormField className="admin-panel-advanced-settings__api-keys__permissions__item" value={canCheckTickets*1} label={i18n('TICKET_CHECK_PERMISSION')} field='checkbox' />
                    <FormField value={canCreateUser*1} label={i18n('USER_CREATION_PERMISSION')} field='checkbox' />
                </div>
                <Button className="admin-panel-advanced-settings__api-keys-button" size="medium" onClick={this.onDeleteKeyClick.bind(this)}>
                    {i18n('DELETE')}
                </Button>
            </div>
        );
    }

    getListingProps() {
        return {
            title: i18n('API_KEYS'),
            enableAddNew: true,
            items: this.state.APIKeys.map((item) => {
                return {
                    content: item.name,
                    icon: ''
                };
            }),
            selectedIndex: this.state.selectedAPIKey,
            onChange: index => this.setState({selectedAPIKey: index, error:''}),
            onAddClick: this.openAPIKeyModal.bind(this)
        };
    }

    openAPIKeyModal() {
        ModalContainer.openModal(
            <Form className="admin-panel-advanced-settings__api-keys-modal" onSubmit={this.addAPIKey.bind(this)}>
                <Header title={i18n('ADD_API_KEY')} description={i18n('ADD_API_KEY_DESCRIPTION')} />
                <FormField name="name" label={i18n('NAME_OF_KEY')} validation="DEFAULT" required fieldProps={{size: 'large'}} />
                <div className="admin-panel-advanced-settings__api-keys__permissions">
                    <FormField className = "admin-panel-advanced-settings__api-keys__permissions__item" name="createTicketPermission" label={i18n('TICKET_CREATION_PERMISSION')} field='checkbox' />
                    <FormField name="ticketNumberPermission" label={i18n('TICKET_NUMBER_RETURN_PERMISSION')} field='checkbox' />
                </div>
                <div className="admin-panel-advanced-settings__api-keys__permissions" >
                    <FormField className = "admin-panel-advanced-settings__api-keys__permissions__item" name="checkTicketPermission" label={i18n('TICKET_CHECK_PERMISSION')} field='checkbox' />
                    <FormField name="userPermission" label={i18n('USER_CREATION_PERMISSION')} field='checkbox' />
                </div>
                <div className="admin-panel-advanced-settings__api-keys__buttons-container">
                    <Button
                        className="admin-panel-advanced-settings__api-keys__cancel-button"
                        onClick={(e) => {e.preventDefault(); ModalContainer.closeModal();}}
                        type='link'
                        size="medium">
                            {i18n('CANCEL')}
                    </Button>
                    <SubmitButton className="admin-panel-advanced-settings__api-keys-modal__submit-button" type="secondary">{i18n('SUBMIT')}</SubmitButton>
                </div>
            </Form>,
            {
                closeButton: {
                    showCloseButton: true
                }
            }
        );
    }

    addAPIKey({name,userPermission,createTicketPermission,checkTicketPermission,ticketNumberPermission}) {
        ModalContainer.closeModal();

        this.setState({
            error: ''
        });

        API.call({
            path: '/system/add-api-key',
            data: {
                name,
                canCreateUsers: userPermission*1,
                canCreateTickets: createTicketPermission*1,
                canCheckTickets: checkTicketPermission*1,
                shouldReturnTicketNumber: ticketNumberPermission*1
            }
        }).then(this.getAllKeys.bind(this));
    }

    getAllKeys() {
        API.call({
            path: '/system/get-api-keys',
            data: {}
        }).then(this.onRetrieveSuccess.bind(this))
    }

    onDeleteKeyClick() {
        const {
            APIKeys,
            selectedAPIKey
        } = this.state;

        AreYouSure.openModal(null, () => {
            return API.call({
                path: '/system/delete-api-key',
                data: {
                    name: APIKeys[selectedAPIKey].name
                }
            }).then(this.getAllKeys.bind(this));
        });
    }

    onRetrieveSuccess(result) {
        this.setState({
            APIKeys: result.data,
            selectedAPIKey: -1,
            error: null
        });
    }

    onCheckboxMandatoryLoginChange() {
        AreYouSure.openModal(null, this.onAreYouSureMandatoryLoginOk.bind(this), 'secure');
    }

    onCheckboxRegistrationChange() {
        AreYouSure.openModal(null, this.onAreYouSureRegistrationOk.bind(this), 'secure');
    }

    onAreYouSureMandatoryLoginOk(password) {
        const { config, dispatch } = this.props;

        return API.call({
            path: config['mandatory-login'] ? '/system/disable-mandatory-login' : '/system/enable-mandatory-login',
            data: {
                password: password
            }
        }).then(() => {
            this.setState({
                messageType: 'success',
                messageTitle: null,
                showMessage: true,
                messageContent: config['mandatory-login'] ? i18n('MANDATORY_LOGIN_DISABLED') : i18n('MANDATORY_LOGIN_ENABLED')
            });
            dispatch(ConfigActions.updateData());
        }).catch(() => this.setState({messageType: 'error', showMessage: true, messageTitle: null, messageContent: i18n('ERROR_UPDATING_SETTINGS')}));
    }

    onAreYouSureRegistrationOk(password) {
        const { config, dispatch } = this.props;

        return API.call({
            path: config['registration'] ? '/system/disable-registration' : '/system/enable-registration',
            data: {
                password: password
            }
        }).then(() => {
            this.setState({
                messageType: 'success',
                showMessage: true,
                messageTitle: null,
                messageContent: config['registration'] ? i18n('REGISTRATION_DISABLED') : i18n('REGISTRATION_ENABLED')
            });
            dispatch(ConfigActions.updateData());
        }).catch(() => this.setState({messageType: 'error', showMessage: true, messageTitle: null, messageContent: i18n('ERROR_UPDATING_SETTINGS')}));
    }

    onImportCSV(event) {
        AreYouSure.openModal(null, this.onAreYouSureCSVOk.bind(this, event.target.value), 'secure');
    }

    onAreYouSureCSVOk(file, password) {
        return API.call({
            path: '/system/csv-import',
            dataAsForm: true,
            data: {
                file,
                password
            }
        })
        .then((result) => this.setState({
            messageType: 'success',
            showMessage: true,
            messageTitle: i18n('SUCCESS_IMPORTING_CSV_DESCRIPTION'),
            messageContent: (result.data.length) ? (
                <div>
                    {i18n('ERRORS_FOUND')}
                    <ul>
                        {result.data.map((error, index) => <li key={`csv-file__key-${index}`} >{error}</li>)}
                    </ul>
                </div>
            ) : null
        }))
        .catch((error) => {
            this.setState({
                messageType: 'error',
                showMessage: true,
                messageTitle: null,
                messageContent: i18n(error.message)
            })
        });
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
        return API.call({
            path: '/system/delete-all-users',
            data: {
                password: password
            }
        }).then(() => this.setState({messageType: 'success', showMessage: true, messageTitle: null, messageContent: i18n('SUCCESS_DELETING_ALL_USERS')}
        )).catch(() => this.setState({messageType: 'error', showMessage: true, messageTitle: null, messageContent: i18n('ERROR_DELETING_ALL_USERS')}));
    }

    onCloseMessage(showMessage) {
        this.setState({
            [showMessage]: false
        });
    }
}

export default connect((store) => {
    return {
        config: store.config
    };
})(AdminPanelAdvancedSettings);
