import React from 'react';
import _ from 'lodash';
import {connect}  from 'react-redux';
import RichTextEditor from 'react-rte-browserify';

import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';
import ConfigActions from 'actions/config-actions';

import AreYouSure from 'app-components/are-you-sure';

import InfoTooltip from 'core-components/info-tooltip';
import Button from 'core-components/button';
import Header from 'core-components/header';
import Listing from 'core-components/listing';
import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import SubmitButton from 'core-components/submit-button';

class AdminPanelDepartments extends React.Component {
    static defaultProps = {
        items: []
    };

    state = {
        formLoading: false,
        selectedIndex: -1,
        edited: false,
        errors: {},
        form: {
            title: '',
            content: RichTextEditor.createEmptyValue(),
            language: 'en'
        }
    };

    render() {
        return (
            <div className="admin-panel-departments">
                <Header title={i18n('DEPARTMENTS')} description={i18n('DEPARTMENTS_DESCRIPTION')} />
                <div className="row">
                    <div className="col-md-3">
                        <Listing {...this.getListingProps()}/>
                    </div>
                    <div className="col-md-9">
                        <Form {...this.getFormProps()}>
                            <FormField label={i18n('NAME')} name="name" validation="NAME" required fieldProps={{size: 'large'}}/>
                            <SubmitButton size="medium" className="admin-panel-departments__update-name-button">{i18n('UPDATE_NAME')}</SubmitButton>
                        </Form>
                        {(this.state.selectedIndex !== -1) ? this.renderOptionalButtons() : null}
                    </div>
                </div>
            </div>
        );
    }

    renderOptionalButtons() {
        return (
            <div className="admin-panel-departments__optional-buttons">
                <div className="admin-panel-departments__discard-button">
                    <Button onClick={this.onDiscardChangesClick.bind(this)}>{i18n('DISCARD_CHANGES')}</Button>
                </div>
                <div className="admin-panel-departments__delete-button">
                    <Button onClick={this.onDeleteClick.bind(this)}>{i18n('DELETE')}</Button>
                </div>
            </div>
        );
    }


    getListingProps() {
        return {
            title: i18n('DEPARTMENTS'),
            items: this.props.departments.map(department => {
                return {
                    content: (
                        <span>
                            {department.name}
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
                path: '/staff/edit-department',
                data: {
                    id: this.getCurrentDepartment().id,
                    name: form.name
                }
            }).then(() => {
                this.setState({formLoading: false});
                this.retrieveDepartments();
            }).catch(this.onItemChange.bind(this, -1));
        } else {
            API.call({
                path: '/staff/add-department',
                data: {
                    name: form.title
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
        AreYouSure.openModal(i18n('WILL_DELETE_DEPARTMENT'), this.deleteDepartment.bind(this));
    }

    deleteDepartment() {
        API.call({
            path: '/staff/delete-department',
            data: {
                id: this.getCurrentDepartment().id
            }
        }).then(() => {
            this.retrieveDepartments();
            this.onItemChange(-1);
        });
    }

    updateForm(index) {
        let form = _.clone(this.state.form);
        let department = this.getCurrentDepartment(index);

        form.name = (department && department.name) || '';

        this.setState({
            selectedIndex: index,
            edited: false,
            formLoading: false,
            form: form,
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
}

export default connect((store) => {
    return {
        departments: store.config.departments
    };
})(AdminPanelDepartments);