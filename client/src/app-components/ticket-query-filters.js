import React from 'react';
import _ from 'lodash';
import {connect}  from 'react-redux';
import AdminDataActions from 'actions/admin-data-actions';

import API from 'lib-app/api-call';
import DateTransformer from 'lib-core/date-transformer';

import Form from 'core-components/form';
import SubmitButton from 'core-components/submit-button';
import FormField from 'core-components/form-field';
import Icon from 'core-components/icon';


const TICKET_STATUSES = {
    ANY: undefined,
    OPENED: 0,
    CLOSED: 1
};

const CLOSED_DROPDOWN_INDEXES = {
    ANY: 0,
    OPENED: 1,
    CLOSED: 2
}

const TICKET_PRIORITIES = {
    ANY: undefined,
    LOW: [0],
    MEDIUM: [1],
    HIGH: [2]
};

const PRIORITIES_DROPDOWN_INDEXES = {
    ANY: 0,
    LOW: 1,
    MEDIUM: 2,
    HIGH: 3
}

class TicketQueryFilters extends React.Component {

    static propTypes = {
        filters: React.PropTypes.shape({
            query: React.PropTypes.string,
            departments: React.PropTypes.string,
            owners: React.PropTypes.string,
            tags: React.PropTypes.string,
            dateRange: React.PropTypes.string,
        }),
        onSubmit: React.PropTypes.func,
        onChange: React.PropTypes.func,
    }

    state = {
        form: this.transformToFormValue(this.props.filters),
    };

    componentDidMount() {
        this.retrieveStaffMembers();
    }

    render() {
        return (
            <div className="ticket-query-filters">
                <Form
                    values={this.state.form}
                    onChange={this.onChangeFrom.bind(this)}
                    onSubmit={this.onSubmitForm.bind(this)}>
                    <div className="ticket-query-filters__search-box">
                        <FormField name="query" field="search-box" />
                    </div>
                    <div className="ticket-query-filters__group">
                        <div className="ticket-query-filters__container">
                            <span>Priority</span>
                            <FormField name="priority" field="select" fieldProps={{items: this.getPriorityItems()}} />
                        </div>
                        <div className="ticket-query-filters__container">
                            <span>Date</span>
                            <FormField
                                name="dateRange"
                                field="date-range"
                                fieldProps={{
                                    defaultValue: this.dateRangeToFormValue(
                                        this.props.filters.dateRange
                                    ),
                                }}
                            />
                        </div>
                        <div className="ticket-query-filters__container">
                            <span>Status</span>
                            <FormField name="closed" field="select" fieldProps={{items: this.getStatusItems()}} />
                        </div>
                    </div>
                    <div className="ticket-query-filters__group">
                        <div className="ticket-query-filters__container">
                            <span className="ticket-query-filters__title">Departments</span>
                            <FormField
                                name="departments"
                                field="autocomplete"
                                fieldProps={{items: this.getDepartmentsItems()}} />
                        </div>
                       <div className="ticket-query-filters__container">
                            <span className="ticket-query-filters__title">Owners</span>
                            <FormField
                                name="owners"
                                field="autocomplete"
                                fieldProps={{items: this.getStaffList()}} />
                        </div>
                    </div>
                   <div className="ticket-query-filters__container">
                        <span>Tags</span>
                        <FormField
                            name="tags"
                            field="tag-selector"
                            fieldProps={{
                                items: this.getTags(this.props.filters.tags),
                                onRemoveClick: this.removeTag.bind(this),
                                onTagSelected: this.addTag.bind(this)
                            }} />
                    </div>
                    <SubmitButton>Filter</SubmitButton>
                </Form>
            </div>
        );
    }

    renderDepartmentOption(department) {
        return (
            <div className="ticket-query-filters__department-option" key={`department-option-${department.id}`}>
                {department.private*1 ?
                    <Icon className="ticket-query-filters__department-option__icon" name='user-secret'/> :
                    null}
                <span className="ticket-query-filters__department-option__name">{department.name}</span>
            </div>
        );
    }

    renderDeparmentSelected(department) {
        return (
            <div className="ticket-query-filters__department-selected" key={`department-selected-${department.id}`}>
                {department.private*1 ?
                    <Icon className="ticket-query-filters__department-selected__icon" name='user-secret'/> :
                    null}
                <span className="ticket-query-filters__department-selected__name">{department.name}</span>
            </div>
        );
    }

    renderStaffOption(staff) {
        return (
            <div className="ticket-query-filters__staff-option" key={`staff-option-${staff.id}`}>
                <img className="ticket-query-filters__staff-option__profile-pic" src={this.getStaffProfilePic(staff)}/>
                <span className="ticket-query-filters__staff-option__name">{staff.name}</span>
            </div>
        );
    }

    renderStaffSelected(staff) {
        return (
            <div className="ticket-query-filters__staff-selected" key={`staff-selected-${staff.id}`}>
                <img className="ticket-query-filters__staff-selected__profile-pic" src={this.getStaffProfilePic(staff)}/>
                <span className="ticket-query-filters__staff-selected__name">{staff.name}</span>
            </div>
        );
    }

    addTag(tag) {
        let selectedTagsName = this.state.form.tags.concat(this.getSelectedTagsName([tag]));

        this.setState({
            form: {
                ...this.state.form,
                tags: selectedTagsName
            }
        });
    }

    dateRangeToFormValue(_dateRange) {
        const dateRange = JSON.parse(_dateRange);

        return {
            valid: true,
            startDate: dateRange[0]/10000,
            endDate: (dateRange[1]-2400)/10000,
        };
    }

    formValueToFilters(form) {
        let departmentsId = form.departments.map(department => department.id);
        let dateRangeFilter = [form.dateRange.startDate, form.dateRange.endDate];
        let newFormValues = {
            query: form.query,
            closed: this.getTicketStatusByDropdownIndex(form.closed),
            priority: this.getTicketPrioritiesByDropdownIndex(form.priority),
            departments: form.departments !== undefined ? JSON.stringify(departmentsId) : "[]",
            owners: JSON.stringify(form.owners),
            tags: JSON.stringify(this.tagsNametoTagsId(form.tags)),
            dateRange: JSON.stringify(DateTransformer.formDateRangeToFilters(dateRangeFilter)),
        };

        return newFormValues;
    }

    getClosedDropdowIndex(status) {
        let closedDropdownIndex;

        switch(status) {
            case TICKET_STATUSES.CLOSED:
                closedDropdownIndex = CLOSED_DROPDOWN_INDEXES.CLOSED;
                break;
            case TICKET_STATUSES.OPENED:
                closedDropdownIndex = CLOSED_DROPDOWN_INDEXES.OPENED;
                break;
            default:
                closedDropdownIndex = CLOSED_DROPDOWN_INDEXES.ANY;
        }

        return closedDropdownIndex;
    }

    getDepartmentsItems() {
        const { departments, } = this.props;
        let departmentsList = departments.map(department => {
            return {
                id: JSON.parse(department.id),
                name: department.name.toLowerCase(),
                color: 'gray',
                contentOnSelected: this.renderDeparmentSelected(department),
                content: this.renderDepartmentOption(department),
            }
        });

        return departmentsList;
    }

    getPriorityDropdownIndex(_priority) {
        let priorityDorpDownIndex = PRIORITIES_DROPDOWN_INDEXES.ANY;

        if(_priority !== undefined) {
            let priority = JSON.parse(_priority)[0];
            switch(priority) {
                case TICKET_PRIORITIES.LOW[0]:
                    priorityDorpDownIndex = PRIORITIES_DROPDOWN_INDEXES.LOW;
                    break;
                case TICKET_PRIORITIES.MEDIUM[0]:
                    priorityDorpDownIndex = PRIORITIES_DROPDOWN_INDEXES.MEDIUM;
                    break;
                case TICKET_PRIORITIES.HIGH[0]:
                    priorityDorpDownIndex = PRIORITIES_DROPDOWN_INDEXES.HIGH;
                    break;
            }
        }

        return priorityDorpDownIndex;
    }

    getPriorityItems() {
        let items = [
            {id: 0, name: 'Any', content: 'Any'},
            {id: 1, name: 'Low', content: 'Low'},
            {id: 2, name: 'Medium', content: 'Medium'},
            {id: 3, name: 'High', content: 'High'},
        ];

        return items;
    }

    getSelectedDepartments(selectedDepartmentsId) {
        let selectedDepartments = [];

        if(selectedDepartmentsId !== undefined) {
            let departments = this.getDepartmentsItems();
            selectedDepartments = departments.filter(item => _.includes(selectedDepartmentsId, item.id));
        }

        return selectedDepartments;
    }

    getSelectedStaffs(selectedStaffsId) {
        let selectedStaffs = [];
        if(selectedStaffsId !== undefined) {
            let staffs = this.getStaffList();
            selectedStaffs = staffs.filter(staff => _.includes(selectedStaffsId, staff.id));
        }

        return selectedStaffs;
    }

    getSelectedTagsName(selectedTagsId) {
        let selectedTagsName = [];

        if(selectedTagsId !== undefined) {
            let tagList = this.getTags();
            let selectedTags = tagList.filter(item => _.includes(selectedTagsId, item.id));
            selectedTagsName = selectedTags.map(tag => tag.name);
        }

        return selectedTagsName;
    }

    getStaffList() {
        const { staffList, } = this.props;
        let newStaffList = staffList.map(staff => {
            return {
                id: JSON.parse(staff.id),
                name: staff.name.toLowerCase(),
                color: 'gray',
                contentOnSelected: this.renderStaffSelected(staff),
                content: this.renderStaffOption(staff),
            }
        });

        return newStaffList;
    }

    getStaffProfilePic(staff) {
        return staff.profilePic ? API.getFileLink(staff.profilePic) : (API.getURL() + '/images/profile.png');
    }

    getStatusItems() {
        let items = [
            {id: 0, name: 'Any', content: 'Any'},
            {id: 1, name: 'Opened', content: 'Opened'},
            {id: 2, name: 'Closed', content: 'Closed'},
        ];

        return items;
    }

    getTags() {
        const { tags, } = this.props;
        let newTagList = tags.map(tag => {
            return {
                id: JSON.parse(tag.id),
                name: tag.name,
                color : tag.color
            }
        });

        return newTagList;
    }

    getTicketPrioritiesByDropdownIndex(dropdownIndex) {
        let priorities = TICKET_PRIORITIES.ANY;

        switch(dropdownIndex) {
            case PRIORITIES_DROPDOWN_INDEXES.LOW:
                priorities = TICKET_PRIORITIES.LOW;
                break;
            case PRIORITIES_DROPDOWN_INDEXES.MEDIUM:
                priorities = TICKET_PRIORITIES.MEDIUM;
                break;
            case PRIORITIES_DROPDOWN_INDEXES.HIGH:
                priorities = TICKET_PRIORITIES.HIGH;
                break;
        }

        return priorities !== undefined ? JSON.stringify(priorities) : priorities;
    }

    getTicketStatusByDropdownIndex(dropdownIndex) {
        let status;

        switch(dropdownIndex) {
            case CLOSED_DROPDOWN_INDEXES.CLOSED:
                status = TICKET_STATUSES.CLOSED;
                break;
            case CLOSED_DROPDOWN_INDEXES.OPENED:
                status = TICKET_STATUSES.OPENED;
                break;
            default:
                status = TICKET_STATUSES.ANY;
        }

        return status;
    }

    onChangeFrom(data) {
        let newStartDate = data.dateRange.startDate === "" ? 20170101 : data.dateRange.startDate;
        let newEndDate = data.dateRange.endDate === "" ? DateTransformer.getDateToday() : data.dateRange.endDate;
        let newData = {
            ...data,
            dateRange: {
                ...data.dateRange,
                startDate: newStartDate,
                endDate : newEndDate
            }
        }

        this.setState({
            form: newData,
        })
    }

    onSubmitForm() {
        const { onSubmit, } = this.props;
        onSubmit && onSubmit(this.formValueToFilters(this.state.form));
    }

    removeTag(tag) {
        let tagListName = this.tagsNametoTagsId(this.state.form.tags);
        let newTagList = tagListName.filter(item => item !== tag);
        let selectedTags = this.getSelectedTagsName(newTagList);

        this.setState({
            form: {
                ...this.state.form,
                tags: selectedTags
            }
        });
    }

    retrieveStaffMembers() {
        this.props.dispatch(AdminDataActions.retrieveStaffMembers());
    }

    tagsNametoTagsId(selectedTagsName) {
        let tagList = this.getTags();
        let selectedTags = tagList.filter(item => _.includes(selectedTagsName, item.name));
        let selectedTagsId = selectedTags.map(tag => tag.id);

        return selectedTagsId;

    }

    transformToFormValue(filters) {
        let newFormValues = {
            ...newFormValues,
            query: filters.query ? filters.query : "",
            closed: this.getClosedDropdowIndex(filters.closed),
            priority: this.getPriorityDropdownIndex(filters.priority),
            departments: this.getSelectedDepartments(JSON.parse(filters.departments)),
            owners: this.getSelectedStaffs(JSON.parse(filters.owners)),
            tags: this.getSelectedTagsName(JSON.parse(filters.tags)),
            dateRange: this.dateRangeToFormValue(filters.dateRange),
        }

        return newFormValues;
    }
}

export default connect((store) => {
    return {
        tags: store.config['tags'],
        departments: store.session.userDepartments,
        staffList: store.adminData.staffMembers,
    };
})(TicketQueryFilters);