import React from 'react';
import {connect}  from 'react-redux';

import i18n from 'lib-app/i18n';
import Header from 'core-components/header';
import Tooltip from 'core-components/tooltip';
import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import Icon from 'core-components/icon';
import API from 'lib-app/api-call';

class AdminPanelStats extends React.Component {

    state = {
        loading: true,
        form: {
            dateRange: {
                startDate: 202009130000,
                endDate: 202009132359
            },
            departments: []
        },
        ticketData: {}
    };

    componentDidMount() {
        this.retrieveStats();
    }

    render() {
        console.warn('DEPARTMENTS: ', this.props.departments);
        console.warn('TAGS: ', this.props.departments);
        console.warn('STAFF LIST: ', this.props.staffList);
        console.warn('FORM STATE: ', this.state.form);
        return (
            <div className="admin-panel-stats">
                <Header title={i18n('STATISTICS')} description={i18n('STATISTICS_DESCRIPTION')}/>
                <Form loading={this.state.loading} values={this.state.form} onChange={this.onFormChange.bind(this)} onSubmit={this.onFormSubmit}>
                    <div className="row">
                        <div className="col-md-6">
                            <FormField name="dateRange" label={i18n('DATE')} field="date-range" fieldProps={{defaultValue: this.state.form.dateRange}}/>
                        </div>
                        <div className="col-md-6">
                            <FormField name="departments" label={i18n('DEPARTMENTS')} field="autocomplete" fieldProps={{items: this.getDepartmentsItems()}} />
                        </div>
                    </div>
                </Form>
                <div className="row">
                    <div className="col-md-12">
                        <span className="separator" />
                    </div>
                </div>
                {this.state.loading ? "Loading..." : this.renderTicketData()}
            </div>
        )
    }

    getDepartmentsItems() {
        const renderDepartmentItem = (department, style) => {
            return (
                <div className={`admin-panel-stats__department-${style}`} key={`department-${style}-${department.id}`}>
                    {department.private*1 ?
                        <Icon className={`admin-panel-stats__department-${style}__icon`} name='user-secret'/> :
                        null}
                    <span className={`admin-panel-stats__department-${style}__name`}>{department.name}</span>
                </div>
            );
        };

        return this.props.departments.map(department => {
            return {
                id: JSON.parse(department.id),
                name: department.name.toLowerCase(),
                color: 'gray',
                contentOnSelected: renderDepartmentItem(department, 'selected'),
                content: renderDepartmentItem(department, 'option'),
            }
        });
    }

    retrieveStats() {
        API.call({
            path: '/system/stats',
            data: {
                dateRange: "[" + this.state.form.dateRange.startDate.toString() + 
                           "," + this.state.form.dateRange.endDate.toString() + 
                           "]",
                departments: "[" + this.state.form.departments.map((department) => department.id).join(',') + "]"
            }
        }).then(({data}) => {
            this.setState({ticketData: data, loading: false}, () => {
                console.log('DATA AFTER CALL TO /system/stats:', this.state);
            });
        }).catch((error) => {
            console.error('ERROR: ', error);
        })
    }

    onFormChange(newFormState) {
        this.setState({form: newFormState}, () => {
            this.retrieveStats();
        });
    }

    onFormSubmit() {
        
    }

    renderTicketData() {
        const {created, open, closed, instant, reopened} = this.state.ticketData;
        const renderCard = (label, description, value, isPercentage) => {
            const displayValue = isNaN(value) ? "-" : (isPercentage ? value.toFixed(2) : value);
            return (
                <div className="admin-panel-stats__card-list__card">
                    <Tooltip content={description} openOnHover>
                        {label}
                    </Tooltip>
                    <div className="admin-panel-stats__card-list__container">
                        {displayValue}{isPercentage && !isNaN(value) ? "%" : ""}
                    </div>
                </div>
            );
        }

        return (
            <div className="admin-panel-stats__card-list">
                {renderCard(i18n('CREATED'), i18n('CREATED_DESCRIPTION'), created, false)}
                {renderCard(i18n('OPEN'), i18n('OPEN_DESCRIPTION'), open, false)}
                {renderCard(i18n('CLOSED'), i18n('CLOSED_DESCRIPTION'), closed, false)}
                {renderCard(i18n('INSTANT'), i18n('INSTANT_DESCRIPTION'), 100*instant / closed, true)}
                {renderCard(i18n('REOPENED'), i18n('REOPENED_DESCRIPTION'), 100*reopened / created, true)}
            </div>
        )
    }
}

export default connect((store) => {
    return {
        tags: store.config.tags,
        departments: store.config.departments,
        staffList: store.adminData.staffMembers
    };
})(AdminPanelStats);