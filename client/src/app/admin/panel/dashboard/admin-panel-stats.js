import React from 'react';
import { connect }  from 'react-redux';

import API from 'lib-app/api-call';
import i18n from 'lib-app/i18n';
import statsUtils from 'lib-app/stats-utils';
import date from 'lib-app/date';

import Header from 'core-components/header';
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
            period: 0,
            departments: [],
            owners: [],
            tags: []
        },
        ticketData: {}
    };

    componentDidMount() {
        statsUtils.retrieveStats({
            rawForm: this.getFormWithDateRange(this.state.rawForm),
            tags: this.props.tags
        }).then(({data}) => {
            this.setState({ticketData: data, loading: false});
        }).catch((error) => {
            if (showLogs) console.error('ERROR: ', error);
        });
    }

    render() {
        const { loading, rawForm, ticketData } = this.state;

        return (
            <div className="admin-panel-stats">
                <Header title={i18n('STATISTICS')} description={i18n('STATISTICS_DESCRIPTION')} />
                <Form className="admin-panel-stats__form" loading={loading} values={rawForm} onChange={this.onFormChange.bind(this)} onSubmit={this.onFormSubmit.bind(this)}>
                    <div className="admin-panel-stats__form__container">
                        <div className="admin-panel-stats__form__container__row">
                            <div className="admin-panel-stats__form__container__col">
                                <FormField name="period" label={i18n('DATE')} field="select" fieldProps={{size: 'large', items: [{content: i18n('LAST_7_DAYS')}, {content: i18n('LAST_30_DAYS')}, {content: i18n('LAST_90_DAYS')}, {content: i18n('LAST_365_DAYS')}]}} />
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
                {
                    loading ?
                        <div className="admin-panel-stats__loading"><Loading backgrounded size="large" /></div> :
                        statsUtils.renderStatistics({showStatCards: true, showStatsByHours: true, showStatsByDays: true, ticketData})
                }
            </div>
        )
    }

    clearFormValues(event) {
        event.preventDefault();
        this.setState({
            rawForm: {
                period: 0,
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

    onFormChange(newFormState) {
        this.setState({rawForm: newFormState});
    }

    onFormSubmit() {
        statsUtils.retrieveStats({
            rawForm: this.getFormWithDateRange(this.state.rawForm),
            tags: this.props.tags
        }).then(({data}) => {
            this.setState({ticketData: data, loading: false});
        }).catch((error) => {
            if (showLogs) console.error('ERROR: ', error);
        });
    }

    getFormWithDateRange(form) {
        const {startDate, endDate} = statsUtils.getDateRangeFromPeriod(form.period);

        return {
            ...form,
            dateRange: {
                startDate,
                endDate
            }
        };
    }
}

export default connect((store) => {
    return {
        tags: store.config.tags,
        departments: store.config.departments,
        staffList: store.adminData.staffMembers
    };
})(AdminPanelStats);
