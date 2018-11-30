import React from 'react';
import _ from 'lodash';
import {connect}  from 'react-redux';

import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';
import ConfigActions from 'actions/config-actions';

import AreYouSure from 'app-components/are-you-sure';
import DepartmentDropDown from 'app-components/department-dropdown';

import InfoTooltip from 'core-components/info-tooltip';
import Button from 'core-components/button';
import Header from 'core-components/header';
import Listing from 'core-components/listing';
import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import SubmitButton from 'core-components/submit-button';
import DropDown from 'core-components/drop-down';
import Icon from 'core-components/icon';
import Message from 'core-components/message';

class AdminPanelDepartments extends React.Component {
    static defaultProps = {
        items: []
    };

    state = {
        formLoading: false,
        selectedIndex: -1,
        selectedDropDownIndex: 0,
        edited: false,
        errorMessage: null,
        errors: {},
        form: {
            title: '',
            language: 'en',
            private: 0,
        }
    };

    render() {
        return (
            <div className="admin-panel-departments">
                <Header title={i18n('DEPARTMENTS')} description={i18n('DEPARTMENTS_DESCRIPTION')} />
                <div className="row">
                    <div className="col-md-4">
                        <Listing {...this.getListingProps()}/>
                    </div>
                    <div className="col-md-8">
                        {(this.state.errorMessage) ? <Message type="error">{i18n(this.state.errorMessage)}</Message> : null}
                        <Form {...this.getFormProps()}>
                            <div>
                                <FormField className="admin-panel-departments__name" label={i18n('NAME')} name="name" validation="NAME" required fieldProps={{size: 'large'}}/>
                                <div className="admin-panel-departments__private-option">
                                    <FormField label={i18n('PRIVATE')} name="private" field="checkbox"/>
                                    <InfoTooltip className="admin-panel-departments__info-tooltip" text={i18n('PRIVATE_DEPARTMENT_DESCRIPTION')} />
                                </div>
                            </div>
                            <SubmitButton size="medium" className="admin-panel-departments__update-name-button" type="secondary">
                                {i18n((this.state.selectedIndex !== -1) ? 'UPDATE_DEPARTMENT' : 'ADD_DEPARTMENT')}
                            </SubmitButton>
                        </Form>
                        {(this.state.selectedIndex !== -1 && this.props.departments.length) ? this.renderOptionalButtons() : null}
                    </div>
                </div>
            </div>
        );
    }

    renderOptionalButtons() {
        return (
            <div className="admin-panel-departments__optional-buttons">
                <div className="admin-panel-departments__discard-button">
                    <Button onClick={this.onDiscardChangesClick.bind(this)} size="medium">{i18n('DISCARD_CHANGES')}</Button>
                </div>
                {this.props.departments.length > 1 ? this.renderDeleteButton() : null}
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
                    <DepartmentDropDown className="admin-panel-departments__transfer-tickets-drop-down" departments={this.getDropDownDepartments()} onChange={(event) => this.setState({selectedDropDownIndex: event.index})} size="medium"/>
                </div>
            </div>
        );
    }

    getListingProps() {
        return {
            className: 'admin-panel-departments__list',
            title: i18n('DEPARTMENTS'),
            items: this.props.departments.map(department => {
                return {
                    content: (
                        <span>
                            {department.name}
                            {department.private*1 ? <Icon className="admin-panel-departments__private-icon" name='user-secret'/> : null }
                            {(!department.owners) ? (
                                <span className="admin-panel-departments__warning">
                                    <InfoTooltip type="warning" text={i18n('NO_STAFF_ASSIGNED')}/>
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
        return {
            values: this.state.form,
            errors: this.state.errors,
            loading: this.state.formLoading,
            onChange: (form) => {this.setState({form, edited: true})},
            onValidateErrors: (errors) => {this.setState({errors})},
            onSubmit: this.onFormSubmit.bind(this)
        };
    }

    onItemChange(index) {
        if(this.state.edited) {
            AreYouSure.openModal(i18n('WILL_LOSE_CHANGES'), this.updateForm.bind(this, index));
        } else {
            this.updateForm(index);
        }
    }

    onFormSubmit(form) {
        this.setState({formLoading: true, edited: false});

        if(this.state.selectedIndex !== -1) {
            API.call({
                path: '/system/edit-department',
                data: {
                    departmentId: this.getCurrentDepartment().id,
                    name: form.name,
                    private: form.private ? 1 : 0
                }
            }).then(() => {
                this.setState({formLoading: false});
                this.retrieveDepartments();
            }).catch(result => this.setState({formLoading: false, errorMessage: result.message}));
        } else {
            API.call({
                path: '/system/add-department',
                data: {
                    name: form.name,
                    private: form.private ? 1 : 0
                }
            }).then(() => {
                this.retrieveDepartments();
                this.onItemChange(-1);
            }).catch(this.onItemChange.bind(this, -1));
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
        API.call({
            path: '/system/delete-department',
            data: {
                departmentId: this.getCurrentDepartment().id,
                transferDepartmentId: this.getDropDownItemId()
            }
        }).then(() => {
            this.retrieveDepartments();
            this.onItemChange(-1);
        })
        .catch(result => this.setState({errorMessage: result.message}));
    }

    updateForm(index) {
        let form = _.clone(this.state.form);
        let department = this.getCurrentDepartment(index);

        form.name = (department && department.name) || '';
        form.private = (department && department.private) || 0;

        this.setState({
            selectedIndex: index,
            edited: false,
            formLoading: false,
            form,
            errorMessage: null,
            errors: {}
        });
    }

    retrieveDepartments() {
        this.props.dispatch(ConfigActions.updateData());
        this.setState({
            edited: false
        });
    }

    getCurrentDepartment(index) {
        return this.props.departments[(index == undefined) ? this.state.selectedIndex : index];
    }

    getDropDownItemId() {
        return this.props.departments.filter((department, index) => index !== this.state.selectedIndex)[this.state.selectedDropDownIndex].id;
    }

    getDropDownDepartments() {
        return this.props.departments.filter((department, index) => index !== this.state.selectedIndex);
    }
}

export default connect((store) => {
    return {
        departments: store.config.departments
    };
})(AdminPanelDepartments);
