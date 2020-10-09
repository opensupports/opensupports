import React from 'react';
import { connect }  from 'react-redux';
import { Bar, HorizontalBar } from 'react-chartjs-2';

import date from 'lib-app/date';
import API from 'lib-app/api-call';
import i18n from 'lib-app/i18n';
import Header from 'core-components/header';
import Tooltip from 'core-components/tooltip';
import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import Icon from 'core-components/icon';
import Loading from 'core-components/loading';
import SubmitButton from 'core-components/submit-button';
import Button from 'core-components/button';

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
        firstDayOfMonth.setHours(0);
        firstDayOfMonth.setMinutes(0);
        let todayAtNight = new Date();
        todayAtNight.setHours(23);
        todayAtNight.setMinutes(59);
        return {
            startDate: date.getFullDate(firstDayOfMonth),
            endDate: date.getFullDate(todayAtNight)
        }
    }

    componentDidMount() {
        this.retrieveStats();
    }

    render() {
        const {
            loading,
            rawForm
        } = this.state;

        return (
            <div className="admin-panel-stats">
                <Header title={i18n('STATISTICS')} description={i18n('STATISTICS_DESCRIPTION')} />
                <Form className="admin-panel-stats__form" loading={loading} values={rawForm} onChange={this.onFormChange.bind(this)} onSubmit={this.onFormSubmit.bind(this)}>
                    <div className="admin-panel-stats__form__container">
                        <div className="admin-panel-stats__form__container__row">
                            <div className="admin-panel-stats__form__container__col">
                                <FormField name="dateRange" label={i18n('DATE')} field="date-range" fieldProps={{defaultValue: rawForm.dateRange}} />
                                <FormField name="tags" label={i18n('TAGS')} field="tag-selector" fieldProps={{items: this.getTagItems()}} />
                            </div>
                            <div className="admin-panel-stats__form__container__col">
                                <FormField name="departments" label={i18n('DEPARTMENTS')} field="autocomplete" fieldProps={{items: this.getDepartmentsItems()}} />
                                <FormField name="owners" label={i18n('OWNER')} field="autocomplete" fieldProps={{items: this.getStaffItems()}} />
                            </div>
                        </div>
                    </div>
                    <div className="admin-panel-stats__container">
                        <Button
                            className="admin-panel-stats__container__button admin-panel-stats__container__clear-button"
                            size= "medium"
                            disabled={loading}
                            onClick={this.clearFormValues.bind(this)}>
                                {loading ? <Loading /> : i18n('CLEAR')}
                        </Button>
                        <SubmitButton
                            className="admin-panel-stats__container__button admin-panel-stats__container__apply-button"
                            type="secondary"
                            size= "medium">
                                {i18n('APPLY')}
                        </SubmitButton>
                    </div>
                </Form>
                <div className="row">
                    <div className="col-md-12">
                        <span className="separator" />
                    </div>
                </div>
                {loading ? <div className="admin-panel-stats__loading"><Loading backgrounded size="large" /></div> : this.renderStatistics()}
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
            labels: [
                i18n('MONDAY'),
                i18n('TUESDAY'),
                i18n('WEDNESDAY'),
                i18n('THURSDAY'),
                i18n('FRIDAY'),
                i18n('SATURDAY'),
                i18n('SUNDAY')
            ],
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
                {this.renderStatCards()}
                <Bar data={ticketsByHoursChartData} legend={{onClick: null}} /> {/* Weird, but if you only set the legend here, it changes that of the HorizontalBar next too*/}
                <HorizontalBar data={ticketsByWeekdayChartData} legend={{onClick: null}} />
            </div>
        );
    }

    renderStatCards() {
        const {created, open, closed, instant, reopened} = this.state.ticketData;

        const renderCard = (label, description, value, isPercentage) => {
            const displayValue = isNaN(value) ? "-" : (isPercentage ? value.toFixed(2) : value);
            return (
                <Tooltip content={description} openOnHover>
                    <div className="admin-panel-stats__card-list__card">
                        <div className="admin-panel-stats__card-list__card__wrapper">
                                {label}
                            <div className="admin-panel-stats__card-list__container">
                                {displayValue}{isPercentage && !isNaN(value) ? "%" : ""}
                            </div>
                        </div>
                    </div>
                </Tooltip>
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

    clearFormValues(event) {
        event.preventDefault();
        this.setState({
            rawForm: {
                dateRange: this.getInitialDateRange(),
                departments: [],
                owners: [],
                tags: []
            }
        });
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
        return this.props.tags.filter(tag => _.includes(this.state.rawForm.tags, tag.name)).map(tag => tag.id);
    }

    getStaffItems() {
        const getStaffProfilePic = (staff) => {
            return staff.profilePic ? API.getFileLink(staff.profilePic) : (API.getURL() + '/images/profile.png');
        }

        const renderStaffItem = (staff, style) => {
            return (
                <div className={`admin-panel-stats__staff-${style}`} key={`staff-${style}-${staff.id}`}>
                    <img className={`admin-panel-stats__staff-${style}__profile-pic`} src={getStaffProfilePic(staff)} />
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
                    {department.private*1 ? <Icon className={`admin-panel-stats__department-${style}__icon`} name='user-secret' /> : null}
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
        this.setState({rawForm: newFormState});
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
