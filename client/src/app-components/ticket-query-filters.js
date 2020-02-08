import React from 'react';
import _ from 'lodash';
import {connect}  from 'react-redux';
import AdminDataActions from 'actions/admin-data-actions';

import API from 'lib-app/api-call';
import DateTransformer from 'lib-core/date-transformer';

import Form from 'core-components/form';
import SubmitButton from 'core-components/submit-button';
import FormField from 'core-components/form-field';
import TagSelector from 'core-components/tag-selector';


export const TICKET_STATUSES = {
    ANY: undefined,
    OPENED: 0,
    CLOSED: 1
};

export const CLOSED_DROPDOWN_INDEXES = {
    ANY: 0,
    OPENED: 1,
    CLOSED: 2
}

export const TICKET_PRIORITIES = {
    ANY: undefined,
    LOW: [0],
    MEDIUM: [1],
    HIGH: [2]
};

export const PRIORITIES_DROPDOWN_INDEXES = {
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
                        <TagSelector
                            items={this.getTags(this.props.filters.tags)}
                            values={this.getSelectedTags().map(tag => tag.name)}
                            onRemoveClick={this.removeTag.bind(this)} 
                            onTagSelected={this.addTag.bind(this)}
                            loading={false}/>
                    </div>
                    <SubmitButton>Filter</SubmitButton>
                </Form>
            </div>
        );
    }

    renderStaffOption(item) {
        return (
            <div className="ticket-query-filters__staff-option" key={`staff-option-${item.id}`}>
                <img className="ticket-query-filters__staff-option__profile-pic" src={this.getStaffProfilePic(item)}/>
                <span className="ticket-query-filters__staff-option__name">{item.name}</span>
            </div>
        );
    }

    renderStaffSelected(item) {
        return (
            <div className="ticket-query-filters__staff-selected" key={`staff-selected-${item.id}`}>
                <img className="ticket-query-filters__staff-selected__profile-pic" src={this.getStaffProfilePic(item)}/>
                <span className="ticket-query-filters__staff-selected__name">{item.name}</span>
            </div>
        );
    }

    onSubmitForm() {
        const { onSubmit, } = this.props;
        onSubmit && onSubmit(this.state.form)
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

    removeTag(tag) {
        const { onSubmit, } = this.props;
        let newTagList = JSON.parse(this.props.filters.tags).filter(item => item !== tag);

        onSubmit && onSubmit({...this.state.form, tags: newTagList});
    }

    addTag(tag) {
        const { onSubmit, } = this.props;
        let newTags = JSON.parse(this.props.filters.tags).concat([tag]);
        onSubmit && onSubmit({...this.state.form, tags: newTags});
    }

    transformToFormValue(filters) {
        let newFormValues = {
            ...newFormValues,
            query: filters.query ? filters.query : "",
            closed: this.getClosedDropdowIndex(filters.closed),
            priority: this.getPriorityDropdownIndex(filters.priority),
            departments: filters.departments ? JSON.parse(filters.departments) : [],
            owners: filters.owners ? JSON.parse(filters.owners) : [],
            tags: filters.tags ? JSON.parse(filters.tags) : [],
            dateRange: this.dateRangeToFormValue(filters.dateRange),
            orderBy: filters.orderBy ? JSON.parse(filters.orderBy) : undefined,
        }

        return newFormValues;
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

    dateRangeToFormValue(_dateRange) {
        const dateRange = JSON.parse(_dateRange);

        return {
            valid: true,
            startDate: dateRange[0]/10000,
            endDate: (dateRange[1]-2400)/10000,
        };
    }

    getSelectedTags() {
        let tagList = this.getTags();
        let tagsSelectedId = JSON.parse(this.props.filters.tags);
        let selectedTags = tagList.filter(item => _.includes(tagsSelectedId, item.id));

        return selectedTags;
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

    getStatusItems() {
        let items = [
            {id: 0, name: 'Any', content: 'Any'},
            {id: 1, name: 'Opened', content: 'Opened'},
            {id: 2, name: 'Closed', content: 'Closed'},
        ];

        return items;
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

    getDepartmentsItems() {
        const { departments, } = this.props;

        let departmentsList = departments.map(department => {
            return {
                id: JSON.parse(department.id),
                name: department.name.toLowerCase(),
                color: 'gray',
                //contentOnSelected: this.renderDeparmentSelected(department),
                content: department.name,
            }
        });

        return departmentsList;
    }

    getSelectedDepartments() {
        let departments = this.getDepartmentsItems();
        let selectedDepartmentsId = JSON.parse(this.props.filters.departments);
        let selectedDepartments = departments.filter(item => _.includes(selectedDepartmentsId, item.id));

        return selectedDepartments;
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

    getSelectedStaffs() {
        let staffs = this.getStaffList();
        let selectedStaffsId = JSON.parse(this.props.filters.owners);
        let selectedStaffs = staffs.filter(staff => _.includes(selectedStaffsId, staff.id));

        return selectedStaffs;
    }

    retrieveStaffMembers() {
        this.props.dispatch(AdminDataActions.retrieveStaffMembers());
    }
}

export default connect((store) => {
    return {
        tags: store.config['tags'],
        departments: store.session.userDepartments,
        staffList: store.adminData.staffMembers,
    };
})(TicketQueryFilters);