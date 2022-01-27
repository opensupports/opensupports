import React from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';

import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';
import ConfigActions from 'actions/config-actions';
import SessionStore from 'lib-app/session-store';

import AreYouSure from 'app-components/are-you-sure';
import DepartmentDropdown from 'app-components/department-dropdown';

import InfoTooltip from 'core-components/info-tooltip';
import Button from 'core-components/button';
import Header from 'core-components/header';
import Listing from 'core-components/listing';
import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import SubmitButton from 'core-components/submit-button';
import Icon from 'core-components/icon';
import Message from 'core-components/message';
import Loading from 'core-components/loading'

function getPublicDepartmentList(){
    return _.filter(SessionStore.getDepartments(),item => item.private != 1)
}

export const getPublicDepartmentIndexFromDepartmentId = (departmentId, departments) => {
    const departmentIndex = _.findIndex(departments, department => department.id == departmentId);

    return (departmentIndex !== -1) ? departmentIndex : 0;
}

class AdminPanelDepartments extends React.Component {
    static defaultProps = {
        items: []
    };

    state = {
        formLoading: false,
        selectedIndex: -1,
        selectedDropDownIndex: 0,
        editedAddDepartmentForm: false,
        editedDefaultDepartmentForm: false,
        errorMessage: null,
        showErrorMessage: true,
        showSuccessMessage: true,
        showDefaultDepartmentErrorMessage: true,
        errors: {},
        defaultDepartmentError: null,
        form: {
            name: '',
            language: 'en',
            private: 0
        },
        defaultDepartment: this.props.defaultDepartmentId,
        defaultDepartmentLocked: this.props.defaultDepartmentLocked * 1
    };

    render() {
        const { errorMessage, formLoading, selectedIndex, showErrorMessage } = this.state;

        return (
            <div className="admin-panel-departments">
                <Header title={i18n('DEPARTMENTS')} description={i18n('DEPARTMENTS_DESCRIPTION')} />
                <div className="row">
                    <div className="col-md-4">
                        <Listing {...this.getListingProps()} />
                    </div>
                    <div className="col-md-8">
                        {
                            errorMessage ?
                                <Message showMessage={showErrorMessage} onCloseMessage={this.onCloseMessage.bind(this, "showErrorMessage")} type="error">
                                    {i18n(errorMessage)}
                                </Message> :
                                null
                        }
                        <Form {...this.getFormProps()}>
                            <div className="admin-panel-departments__container">
                                <FormField className="admin-panel-departments__container__name" label={i18n('NAME')} name="name" validation="NAME" required fieldProps={{size: 'large'}} />
                                <div className="admin-panel-departments__private-option">
                                    <FormField label={i18n('PRIVATE')} name="private" field="checkbox" />
                                    <InfoTooltip className="admin-panel-departments__container__info-tooltip" text={i18n('PRIVATE_DEPARTMENT_DESCRIPTION')} />
                                </div>
                            </div>
                            <div className="admin-panel-departments__buttons-container">
                                {(selectedIndex !== -1 && this.props.departments.length) ? this.renderOptionalButtons() : null}
                                <div className="admin-panel-departments__update-name-button__container">
                                    <SubmitButton
                                        size="medium"
                                        className="admin-panel-departments__update-name-button"
                                        type="secondary">
                                            {
                                                formLoading ?
                                                    <Loading /> :
                                                    i18n((selectedIndex !== -1) ? 'UPDATE_DEPARTMENT' : 'ADD_DEPARTMENT')
                                            }
                                    </SubmitButton>
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
                {this.renderDefaultDepartmentForm()}
            </div>
        );
    }

    renderDefaultDepartmentForm() {
        const { defaultDepartmentError, formLoading, showSuccessMessage, showDefaultDepartmentErrorMessage } = this.state;

        return (
            <div className="admin-panel-departments__default-departments-container">
                <span className="separator" />
                {(defaultDepartmentError !== null) ?
                    ((!defaultDepartmentError) ?
                        <Message showMessage={showSuccessMessage} onCloseMessage={this.onCloseMessage.bind(this, "showSuccessMessage")} type="success">
                            {i18n('SETTINGS_UPDATED')}
                        </Message> :
                        <Message showMessage={showDefaultDepartmentErrorMessage} onCloseMessage={this.onCloseMessage.bind(this, "showDefaultDepartmentErrorMessage")} type="error">
                            {i18n(defaultDepartmentError)}
                        </Message>) :
                    null}
                <Form {...this.getDefaultDepartmentFormProps()} className="admin-panel-departments__default-departments-container__form">
                    <div className="admin-panel-departments__default-departments-container__form__fields" >
                        <FormField
                            className="admin-panel-departments__default-departments-container__form__fields__select"
                            label={i18n('DEFAULT_DEPARTMENT')}
                            name="defaultDepartment"
                            field="select"
                            decorator={DepartmentDropdown}
                            fieldProps={{departments: getPublicDepartmentList(), size: 'medium'}} />
                        <FormField className="admin-panel-departments__default-departments-container__form__fields__checkbox" label={i18n('LOCK_DEPARTMENT_DESCRIPTION')} name="locked" field="checkbox" />
                    </div>
                    <SubmitButton
                        className="admin-panel-departments__default-departments-container__form__button"
                        size="medium"
                        type="secondary" >
                            {formLoading ? <Loading /> : i18n('UPDATE_DEFAULT_DEPARTMENT')}
                    </SubmitButton>
                </Form>
            </div>
        )
    }

    renderOptionalButtons() {
        return (
            <div className="admin-panel-departments__optional-buttons-container">
                {this.props.departments.length > 1 ? this.renderDeleteButton() : null}
                {
                    (this.state.editedAddDepartmentForm) ?
                        <div className="admin-panel-departments__discard-button">
                            <Button onClick={this.onDiscardChangesClick.bind(this)} size="medium">{i18n('DISCARD_CHANGES')}</Button>
                        </div> :
                        null
                }
            </div>
        );
    }

    renderDeleteButton() {
        return (
            <div className="admin-panel-departments__delete-button">
                <Button onClick={this.onDeleteClick.bind(this)} size="medium">{i18n('DELETE')}</Button>
            </div>
        );
    }

    renderDelete() {
        return (
            <div>
                {i18n('WILL_DELETE_DEPARTMENT')}
                <div className="admin-panel-departments__transfer-tickets">
                    <span className="admin-panel-departments__transfer-tickets-title">{i18n('TRANSFER_TICKETS_TO')}</span>
                    <DepartmentDropdown
                        className="admin-panel-departments__transfer-tickets-drop-down"
                        departments={this.getDropDownDepartments()}
                        onChange={(event) => this.setState({selectedDropDownIndex: event.index})}
                        size="medium" />
                </div>
            </div>
        );
    }

    getListingProps() {
        const { departments, defaultDepartmentId } = this.props;

        return {
            className: 'admin-panel-departments__list',
            title: i18n('DEPARTMENTS'),
            items: departments.map(department => {
                return {
                    content: (
                        <span>
                            {department.name}
                            {department.private*1 ? <Icon className="admin-panel-departments__private-icon" name='user-secret' /> : null}
                            {department.id == defaultDepartmentId ? <spam className="admin-panel-departments__default-icon"> {i18n('DEFAULT')} </spam> : null}
                            {(!department.owners) ? (
                                <span className="admin-panel-departments__warning">
                                    <InfoTooltip type="warning" text={i18n('NO_STAFF_ASSIGNED')} />
                                </span>
                            ) : null}
                        </span>
                    )
                };
            }),
            selectedIndex: this.state.selectedIndex,
            enableAddNew: true,
            onChange: this.onItemChange.bind(this),
            onAddClick: this.onItemChange.bind(this, -1)
        };
    }

    getFormProps() {
        const { form, errors, formLoading } = this.state;

        return {
            values: {...form, private: !!form.private},
            errors: errors,
            loading: formLoading,
            onChange: (form) => {this.setState({form, editedAddDepartmentForm: true})},
            onValidateErrors: (errors) => {this.setState({errors})},
            onSubmit: this.onFormSubmit.bind(this),
            loading: formLoading,
            className: 'admin-panel-departments__form'
        };
    }

    getDefaultDepartmentFormProps() {
        const { formLoading, defaultDepartment, defaultDepartmentLocked } = this.state;

        return {
            values: {
                defaultDepartment: getPublicDepartmentIndexFromDepartmentId(defaultDepartment, getPublicDepartmentList()),
                locked: defaultDepartmentLocked ? true : false,
            },
            onChange: (formValue) => {
                this.setState({
                    editedDefaultDepartmentForm: true,
                    defaultDepartmentError: null,
                    defaultDepartment: getPublicDepartmentList()[formValue.defaultDepartment].id,
                    defaultDepartmentLocked: formValue.locked
                });
            },
            onSubmit: this.onDefaultDepartmentFormSubmit.bind(this),
            loading: formLoading
        };
    }

    onCloseMessage(showMessage) {
        this.setState({
            [showMessage]: false
        });
    }

    onItemChange(index) {
        if(this.state.editedAddDepartmentForm) {
            AreYouSure.openModal(i18n('WILL_LOSE_CHANGES'), this.updateForm.bind(this, index));
        } else {
            this.updateForm(index);
        }
    }

    onDefaultDepartmentFormSubmit(formValue) {
        let publicDepartments = getPublicDepartmentList();

        this.setState({formLoading: true, editedDefaultDepartmentForm: false});

        API.call({
            path: '/system/edit-settings',
            data: {
                'default-department-id': this.getCurrentDepartment(publicDepartments, formValue.defaultDepartment).id,
                'default-is-locked': formValue.locked ? 1 : 0
            }
        }).then(() => {
            this.retrieveDepartments(true);
            this.setState({formLoading: false, errorMessage: false, defaultDepartmentError: false, showSuccessMessage: true});
        }).catch(result => this.setState({formLoading: false, defaultDepartmentError: result.message, showDefaultDepartmentErrorMessage: true}));
    }

    onFormSubmit(form) {
        this.setState({formLoading: true, editedAddDepartmentForm: false});

        if(this.state.selectedIndex !== -1) {
            API.call({
                path: '/system/edit-department',
                data: {
                    departmentId: this.getCurrentDepartment(this.props.departments).id,
                    name: form.name,
                    private: form.private ? 1 : 0
                }
            }).then(() => {
                this.setState({formLoading: false, errorMessage: false, defaultDepartmentError: null});
                this.retrieveDepartments();
            }).catch(result => this.setState({formLoading: false, errorMessage: result.message, showErrorMessage: true, defaultDepartmentError: null}));
        } else {
            API.call({
                path: '/system/add-department',
                data: {
                    name: form.name,
                    private: form.private ? 1 : 0
                }
            }).then(() => {
                this.setState({formLoading: false,errorMessage: false, defaultDepartmentError: null});
                this.retrieveDepartments();
                this.onItemChange(-1);
            }).catch(result => {
                this.onItemChange.bind(this, -1);
                this.setState({formLoading: false, errorMessage: result.message, showErrorMessage: true, defaultDepartmentError: null});
            });
        }
    }

    onDiscardChangesClick() {
        this.onItemChange(this.state.selectedIndex);
    }

    onDeleteClick() {
        this.setState({
            selectedDropDownIndex: 0
        });

        AreYouSure.openModal(this.renderDelete(), this.deleteDepartment.bind(this));
    }

    deleteDepartment() {
        return API.call({
            path: '/system/delete-department',
            data: {
                departmentId: this.getCurrentDepartment(this.props.departments).id,
                transferDepartmentId: this.getDropDownItemId()
            }
        }).then(() => {
            this.retrieveDepartments();
            this.onItemChange(-1);
            this.setState({defaultDepartmentError: null});
        })
        .catch(result => this.setState({errorMessage: result.message, showErrorMessage: true, defaultDepartmentError: null}));
    }

    updateForm(index) {
        let form = _.clone(this.state.form);
        let department = this.getCurrentDepartment(this.props.departments, index);

        form.name = (department && department.name) || '';
        form.private = (department && department.private) || 0;

        this.setState({
            selectedIndex: index,
            editedAddDepartmentForm: false,
            formLoading: false,
            form,
            errorMessage: null,
            errors: {},
            defaultDepartmentError: null
        });
    }

    retrieveDepartments(fromUpdateDefaultDepartmentForm = false) {
        this.props.dispatch(ConfigActions.updateData());

        this.setState(
            fromUpdateDefaultDepartmentForm ?
                {editedDefaultDepartmentForm: false} :
                {editedAddDepartmentForm: false}
        );
    }

    getCurrentDepartment(list, index) {
        return list[(index == undefined) ? this.state.selectedIndex : index];
    }

    getDropDownItemId() {
        const { selectedIndex, selectedDropDownIndex } = this.state;

        return this.props.departments.filter((department, index) => index !== selectedIndex)[selectedDropDownIndex].id;
    }

    getDropDownDepartments() {
        return this.props.departments.filter((department, index) => index !== this.state.selectedIndex);
    }
}

export default connect((store) => {
    return {
        defaultDepartmentId: store.config['default-department-id']*1,
        defaultDepartmentLocked: store.config['default-is-locked']*1,
        departments: store.config.departments
    };
})(AdminPanelDepartments);
