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
        rawForm: {
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
        return (
            <div className="admin-panel-stats">
                <Header title={i18n('STATISTICS')} description={i18n('STATISTICS_DESCRIPTION')}/>
                <Form loading={this.state.loading} values={this.getForm()} onChange={this.onFormChange.bind(this)} onSubmit={this.onFormSubmit}>
                    <div className="row">
                        <div className="col-md-6">
                            <FormField name="dateRange" label={i18n('DATE')} field="date-range" fieldProps={{defaultValue: this.state.rawForm.dateRange}}/>
                            {/* <FormField name="tags" label={i18n('TAGS')} field="autocomplete" fieldProps={{items: this.getTagItems()}} /> */}
                            <FormField name="tags" label={i18n('TAGS')} field="tag-selector" fieldProps={{items: this.getTagItems()}} />
                        </div>
                        <div className="col-md-6">
                            <FormField name="departments" label={i18n('DEPARTMENTS')} field="autocomplete" fieldProps={{items: this.getDepartmentsItems()}} />
                            <FormField name="owners" label={i18n('OWNER')} field="autocomplete" fieldProps={{items: this.getStaffItems()}} />
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

    getForm() {
        const { rawForm } = this.state;
        console.warn(rawForm);
        console.warn(rawForm.tags);
        return {
            ...rawForm,
            tags: rawForm.tags ? rawForm.tags.map((tag) => tag.name) : []
        };
    }

    getTagItems() {
        return this.props.tags.map((tag) => {
            return {
                id: JSON.parse(tag.id),
                name: tag.name,
                color : tag.color
            }
        });
    }

    getStaffItems() {
        return [];
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
        const { rawForm } = this.state;
        API.call({
            path: '/system/stats',
            data: {
                dateRange: "[" + rawForm.dateRange.startDate.toString() + 
                           "," + rawForm.dateRange.endDate.toString() + 
                           "]",
                departments: "[" + rawForm.departments.map((department) => department.id).join(',') + "]"
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
        this.setState({rawForm: newFormState}, () => {
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