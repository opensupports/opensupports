import React from 'react';
import _ from 'lodash';
import {connect}  from 'react-redux';
import AdminDataActions from 'actions/admin-data-actions';

import API from 'lib-app/api-call';
import keyCode from 'keycode';
import DateTransformer from 'lib-core/date-transformer';

import Input from 'core-components/input';
import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import TagSelector from 'core-components/tag-selector';
import Autocomplete from '../core-components/autocomplete';
import DateRange from '../core-components/date-range';


class TicketQueryFilters extends React.Component {

    static propTypes = {
        onChange: React.PropTypes.func,
        departments: React.PropTypes.array,
        tags: React.PropTypes.array,
        defaultValue: React.PropTypes.shape(),
    }

    state = {
        filters: this.props.defaultValue,
        value: undefined,
    }

    componentDidMount() {
        this.retrieveStaffMembers();
    }

    render() {
        return (
            <div className="ticket-query-filters">
                <Form value={{ status: [], }} onChange={this.onChangeFrom.bind(this)}>
                    <div className="ticket-query-filters__container">
                        <span>Query</span>
                        <Input
                            className="ticket-query-filters__input"
                            value={this.state.query}
                            onKeyDown={e => this.onKeyDown(e)}
                            onChange={e => this.onChangeInput(e.target.value)} />
                    </div>
                    <div className="ticket-query-filters__container">
                        <span>Status</span>
                        <FormField name="status" field="select" fieldProps={{items: this.getStatusItems()}} />
                    </div>
                    <div className="ticket-query-filters__container">
                        <span>Priority</span>
                        <FormField name="priority" field="select" fieldProps={{items: this.getPriorityItems()}} />
                    </div>
                    <div className="ticket-query-filters__container">
                        <span>Departments</span>
                        <Autocomplete
                            items={this.getDepartmentsItems()}
                            values={this.getSelectedDepartments()}
                            onChange={this.onChangeDepartmentFilters.bind(this)}/>
                    </div>
                    <div className="ticket-query-filters__container">
                        <span>Owners</span>
                        <Autocomplete
                            items={this.getStaffList()}
                            values={this.getSelectedStaffs()}
                            onChange={this.onChangeStaffFilters.bind(this)} />
                    </div>
                    <div className="ticket-query-filters__container">
                        <span>Tags</span>
                        <TagSelector
                            items={this.getTags(this.props.tags)}
                            values={this.getSelectedTags().map(tag => tag.name)}
                            onTagSelected={this.addTag.bind(this)}
                            onRemoveClick={this.removeTag.bind(this)}
                        />
                    </div>
                    <div className="ticket-query-filters__container">
                        <span>Date</span>
                        <DateRange
                            value={this.state.value}
                            onChange={this.onChangeDateRange.bind(this)} />
                    </div>
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

    onChangeInput(str) {
        this.setState({
            filters: {...this.state.filters, query: str},
        });
    }
    
    onKeyDown(event) {
        const { onChange, } = this.props;

        if(keyCode(event) === "enter") {
            onChange && onChange(this.state.filters);
        }
    }

    onChangeFrom(data) {
        const { onChange, } = this.props;
        let status = data.status === 0 ? undefined : data.status-1;
        let priority = data.priority === 0 ? undefined : JSON.stringify([data.priority-1]);
        let newFilters = {
            ...this.state.filters,
            closed: status,
            priority: priority,
        };

        this.setState({
            filters: newFilters,
        });
        onChange && onChange(newFilters);
    }

    onChangeDepartmentFilters(departments) {
        const { onChange, } = this.props;
        let departmentIdList = departments.map(department => department.id);
        let newDepartment = JSON.stringify(departmentIdList);
        let newFilters = {
            ...this.state.filters,
            departments: newDepartment,
        };

        this.setState({
            filters: newFilters,
        });
        onChange && onChange(newFilters);
    }

    onChangeStaffFilters(staffs) {
        const { onChange, } = this.props;
        let staffIdList = staffs.map(staff => staff.id);
        let newStaffIdList = JSON.stringify(staffIdList);
        let newFilters = {
            ...this.state.filters,
            owners: newStaffIdList,
        }

        this.setState({
            filters: newFilters,
        });
        onChange && onChange(newFilters);
    }

    onChangeDateRange(value) {
        const { onChange, } = this.props;
        let startDate = value.startDate === "" ? 20170101 : value.startDate;
        let endDate = value.endDate === "" ? DateTransformer.getDateToday() : value.endDate;
        let newDateRange = JSON.stringify([startDate*10000, (endDate*10000)+2400]);
        let newFilters = {
            ...this.state.filters,
            dateRange: value.valid ? newDateRange : undefined
        }

        this.setState({
            value: {
                startDate: startDate,
                endDate: endDate,
                valid: value.valid,
            },
            filters: newFilters,
        });
        onChange && onChange(newFilters);
    }

    removeTag(tag) {
        const { onChange, } = this.props;
        let newTagList = JSON.stringify((JSON.parse(this.state.filters.tags)).filter(item => item !== tag));

        this.setState({
            filters: {...this.state.filters, tags: newTagList},
        });
        onChange && onChange({...this.state.filters, tags: newTagList});
    }

    addTag(tag) {
        const { onChange, } = this.props;
        let newTags = JSON.stringify(JSON.parse(this.state.filters.tags).concat([tag]));

        this.setState({
            filters: {...this.state.filters, tags: newTags},
        });
        onChange && onChange({...this.state.filters, tags: newTags});
    }

    getSelectedTags() {
        let tagList = this.getTags();
        let tagsSelectedId = JSON.parse(this.state.filters.tags);
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
            {id: 1, name: 'Opend', content: 'Opend'},
            {id: 2, name: 'Closed', content: 'Closed'},
        ];

        return items;
    }

    getPriorityItems() {
        let items = [
            {id: 0, name: 'Any', content: 'Any'},
            {id: 1, name: 'Low', content: 'Low'},
            {id: 2, name: 'Medium', content: 'Madium'},
            {id: 3, name: 'High', content: 'High'},
        ];

        return items;
    }

    getDepartmentsItems() {
        const { departments, } = this.props;

        let departmentsList = departments.map(department => {
            return {
                id: JSON.parse(department.id),
                name: department.name,
                content: department.name,
                color: 'gray',
            }
        });

        return departmentsList;
    }

    getSelectedDepartments() {
        let departments = this.getDepartmentsItems();
        let selectedDepartmentsId = JSON.parse(this.state.filters.departments);
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
        let selectedStaffsId = JSON.parse(this.state.filters.owners);
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