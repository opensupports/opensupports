import React from 'react';
import { connect }  from 'react-redux';
import { Bar, HorizontalBar } from 'react-chartjs-2';

import date from 'lib-app/date';
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
            dateRange: this.getInitialDateRange(),
            departments: [],
            owners: [],
            tags: []
        },
        ticketData: {}
    };

    getInitialDateRange() {
        let firstDayOfMonth = new Date();
        firstDayOfMonth.setDate(1);
        return {
            startDate: date.getFullDate(firstDayOfMonth),
            endDate: date.getCurrentFullDate()
        }
    }

    componentDidMount() {
        this.retrieveStats();
    }

    render() {
        return (
            <div className="admin-panel-stats">
                <Header title={i18n('STATISTICS')} description={i18n('STATISTICS_DESCRIPTION')}/>
                <Form className="admin-panel-stats__form" loading={this.state.loading} values={this.state.rawForm} onChange={this.onFormChange.bind(this)} onSubmit={this.onFormSubmit}>
                    <div className="admin-panel-stats__form__row">
                        <div className="admin-panel-stats__form__col">
                            <FormField name="dateRange" label={i18n('DATE')} field="date-range" fieldProps={{defaultValue: this.state.rawForm.dateRange}}/>
                            <FormField name="tags" label={i18n('TAGS')} field="tag-selector" fieldProps={{items: this.getTagItems()}} />
                        </div>
                        <div className="admin-panel-stats__form__col">
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
                {this.state.loading ? "Loading..." : this.renderStatistics()}
            </div>
        )
    }
    
    renderStatistics() {
        const primaryBlueWithTransparency = (alpha) => `rgba(32, 184, 197, ${alpha})`;
        const ticketsByHoursChartData = {
            labels: Array.from(Array(24).keys()),
            datasets: [
                {
                    label: 'Created Tickets by Hour',
                    backgroundColor: primaryBlueWithTransparency(0.2),
                    borderColor: primaryBlueWithTransparency(1),
                    borderWidth: 1,
                    hoverBackgroundColor: primaryBlueWithTransparency(0.4),
                    hoverBorderColor: primaryBlueWithTransparency(1),
                    data: this.state.ticketData.created_by_hour
                }
            ]
        };

        const primaryGreenWithTransparency = (alpha) => `rgba(130, 202, 156, ${alpha})`;
        const ticketsByWeekdayChartData = {
            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], // Add i18n
            datasets: [
                {
                    label: 'Created Tickets by Weekday',
                    backgroundColor: primaryGreenWithTransparency(0.2),
                    borderColor: primaryGreenWithTransparency(1),
                    borderWidth: 1,
                    hoverBackgroundColor: primaryGreenWithTransparency(0.4),
                    hoverBorderColor: primaryGreenWithTransparency(1),
                    data: this.state.ticketData.created_by_weekday
                }
            ]
        }

        return (
            <div>
                {this.renderTicketData()}
                <Bar data={ticketsByHoursChartData} legend={{onClick: null}}/> {/* Weird, but if you only set the legend here, it changes that of the HorizontalBar next too*/}
                <HorizontalBar data={ticketsByWeekdayChartData} legend={{onClick: null}}/>
            </div>
        );
    }

    renderTicketData() {
        const {created, open, closed, instant, reopened} = this.state.ticketData;

        const renderCard = (label, description, value, isPercentage) => {
            const displayValue = isNaN(value) ? "-" : (isPercentage ? value.toFixed(2) : value);
            return (
                <div className="admin-panel-stats__card-list__card">
                    <div className="admin-panel-stats__card-list__card__wrapper">
                        <Tooltip content={description} openOnHover>
                            {label}
                        </Tooltip>
                        <div className="admin-panel-stats__card-list__container">
                            {displayValue}{isPercentage && !isNaN(value) ? "%" : ""}
                        </div>
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

    getTagItems() {
        return this.props.tags.map((tag) => {
            return {
                id: JSON.parse(tag.id),
                name: tag.name,
                color : tag.color
            }
        });
    }

    getSelectedTagIds() {
        return this.props.tags.filter(tag => _.includes(this.state.rawForm.tags, tag.name))
                              .map(tag => tag.id);
    }

    getStaffItems() {
        const getStaffProfilePic = (staff) => {
            return staff.profilePic ? API.getFileLink(staff.profilePic) : (API.getURL() + '/images/profile.png');
        }

        const renderStaffItem = (staff, style) => {
            return (
                <div className={`admin-panel-stats__staff-${style}`} key={`staff-${style}-${staff.id}`}>
                    <img className={`admin-panel-stats__staff-${style}__profile-pic`} src={getStaffProfilePic(staff)}/>
                    <span className={`admin-panel-stats__staff-${style}__name`}>{staff.name}</span>
                </div>
            )
        };

        const { staffList } = this.props;
        let newStaffList = staffList.map(staff => {
            return {
                id: JSON.parse(staff.id),
                name: staff.name.toLowerCase(),
                color: 'gray',
                contentOnSelected: renderStaffItem(staff, 'selected'),
                content: renderStaffItem(staff, 'option'),
            }
        });

        return newStaffList;
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
        const { startDate, endDate } = rawForm.dateRange;
        API.call({
            path: '/system/stats',
            data: {
                dateRange: "[" + startDate.toString() + "," + endDate.toString() + "]",
                departments: "[" + rawForm.departments.map(department => department.id) + "]",
                owners: "[" + rawForm.owners.map(owner => owner.id) + "]",
                tags: "[" + this.getSelectedTagIds() + "]"
            }
        }).then(({data}) => {
            this.setState({ticketData: data, loading: false});
        }).catch((error) => {
            if (showLogs) console.error('ERROR: ', error);
        })
    }

    onFormChange(newFormState) {
        this.setState({rawForm: newFormState}, () => {
            this.retrieveStats();
        });
    }

    onFormSubmit() {
        this.retrieveStats();
    }
}

export default connect((store) => {
    return {
        tags: store.config.tags,
        departments: store.config.departments,
        staffList: store.adminData.staffMembers
    };
})(AdminPanelStats);
