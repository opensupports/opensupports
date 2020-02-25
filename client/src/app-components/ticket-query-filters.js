import React from 'react';
import _ from 'lodash';
import {connect}  from 'react-redux';
import AdminDataActions from 'actions/admin-data-actions';
import SearchFiltersActions from 'actions/search-filters-actions';

import i18n from 'lib-app/i18n';

import API from 'lib-app/api-call';
import DateTransformer from 'lib-core/date-transformer';

import Form from 'core-components/form';
import SubmitButton from 'core-components/submit-button';
import FormField from 'core-components/form-field';
import Icon from 'core-components/icon';
import Button from 'core-components/button';


const DEFAULT_START_DATE = 20170101;

class TicketQueryFilters extends React.Component {

    static propTypes = {
        filters: React.PropTypes.shape({
            query: React.PropTypes.string,
            departments: React.PropTypes.string,
            owners: React.PropTypes.string,
            tags: React.PropTypes.string,
            dateRange: React.PropTypes.string,
        })
    }

    componentDidMount() {
        this.retrieveStaffMembers();
    }

    render() {
        const {
            formState,
            listDataState
        } = this.props;

        return (
            <div className={"ticket-query-filters" + (this.props.showFilters ? "__open" : "") }>
                <Form
                    values={this.formToAutocompleteValue(formState)}
                    onChange={this.onChangeForm.bind(this)}
                    onSubmit={this.onSubmitForm.bind(this)}>
                    <div className="ticket-query-filters__search-box">
                        <FormField name="query" field="search-box" />
                    </div>
                    <div className="ticket-query-filters__group">
                        <div className="ticket-query-filters__group__container">
                            <span>{i18n('PRIORITY')}</span>
                            <FormField name="priority" field="select" fieldProps={{items: this.getPriorityItems()}} />
                        </div>
                        <div className="ticket-query-filters__group__container">
                            <span>{i18n('DATE')}</span>
                            <FormField
                                name="dateRange"
                                field="date-range"
                                fieldProps={{defaultValue: this.dateRangeToFormValue(listDataState.filters.dateRange)}}
                            />
                        </div>
                        <div className="ticket-query-filters__group__container">
                            <span>{i18n('STATUS')}</span>
                            <FormField name="closed" field="select" fieldProps={{items: this.getStatusItems()}} />
                        </div>
                    </div>
                    <div className="ticket-query-filters__group">
                        <div className="ticket-query-filters__group__container">
                            <span className="ticket-query-filters__title">{i18n('DEPARTMENTS')}</span>
                            <FormField
                                name="departments"
                                field="autocomplete"
                                fieldProps={{items: this.getDepartmentsItems()}} />
                        </div>
                        <div className="ticket-query-filters__group__container">
                            <span className="ticket-query-filters__title">{i18n('OWNER')}</span>
                            <FormField
                                name="owners"
                                field="autocomplete"
                                fieldProps={{items: this.getStaffList()}} />
                        </div>
                    </div>
                    <div className="ticket-query-filters__group">
                        <div className="ticket-query-filters__group__container">
                            <span>{i18n('TAGS')}</span>
                            <FormField
                                name="tags"
                                field="tag-selector"
                                fieldProps={{
                                    items: this.getTags(listDataState.filters.tags),
                                    onRemoveClick: this.removeTag.bind(this),
                                    onTagSelected: this.addTag.bind(this)
                                }} />
                        </div>
                    </div>
                    <div className="ticket-query-filters__container">
                        <Button
                            className="ticket-query-filters__container__button ticket-query-filters__container__clear-button"
                            size= "medium"
                            onClick={this.clearFormValues.bind(this)}>
                                {i18n('CLEAR')}
                        </Button>
                        <SubmitButton
                            type="secondary"
                            size= "medium"
                            className="ticket-query-filters__container__button ticket-query-filters__container__search-button">
                                {i18n('SEARCH')}
                        </SubmitButton>
                    </div>
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
        const { formState } = this.props;
        let selectedTagsId = formState.tags.concat(this.tagsNametoTagsId(this.getSelectedTagsName([tag])));

        this.onChangeFormState({...formState, tags: selectedTagsId});
    }

    dateRangeToFormValue(_dateRange) {
        const dateRange = JSON.parse(_dateRange);

        return {
            valid: true,
            startDate: dateRange[0]/10000,
            endDate: (dateRange[1]-2400)/10000,
        };
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

    getPriorityItems() {
        let items = [
            {id: 0, name: 'Any', content: i18n('ANY')},
            {id: 1, name: 'Low', content: i18n('LOW')},
            {id: 2, name: 'Medium', content: i18n('MEDIUM')},
            {id: 3, name: 'High', content: i18n('HIGH')},
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
            {id: 0, name: 'Any', content: i18n('ANY')},
            {id: 1, name: 'Opened', content: i18n('OPENED')},
            {id: 2, name: 'Closed', content: i18n('CLOSED')},
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

    onChangeForm(data) {
        let newStartDate = data.dateRange.startDate === "" ? DEFAULT_START_DATE : data.dateRange.startDate;
        let newEndDate = data.dateRange.endDate === "" ? DateTransformer.getDateToday() : data.dateRange.endDate;
        let departmentsId = data.departments.map(department => department.id);
        let staffsId = data.owners.map(staff => staff.id);
        let tagsName = this.tagsNametoTagsId(data.tags);

        this.onChangeFormState({
            ...data,
            tags: tagsName,
            owners: staffsId,
            departments: departmentsId,
            dateRange: {
                ...data.dateRange,
                startDate: newStartDate,
                endDate: newEndDate
            }
        });
    }

    onChangeFormState(formValues) {
        this.props.dispatch(SearchFiltersActions.changeForm(formValues));
    }

    onSubmitForm() {
        const {
            formState,
            listDataState,
            dispatch
        } = this.props;
        dispatch(SearchFiltersActions.submitForm({...formState, orderBy: listDataState.filters.orderBy}));
    }

    removeTag(tag) {
        const { formState } = this.props;
        let tagListName = formState.tags;
        let newTagList = tagListName.filter(item => item !== tag);
        let selectedTags = this.tagsNametoTagsId(this.getSelectedTagsName(newTagList));

        this.onChangeFormState({...formState, tags: selectedTags});
    }

    retrieveStaffMembers() {
        this.props.dispatch(AdminDataActions.retrieveStaffMembers());
    }

    clearFormValues(event) {
        event.preventDefault();
        this.props.dispatch(SearchFiltersActions.setDefaultFormValues());
    }

    tagsNametoTagsId(selectedTagsName) {
        let tagList = this.getTags();
        let selectedTags = tagList.filter(item => _.includes(selectedTagsName, item.name));
        let selectedTagsId = selectedTags.map(tag => tag.id);

        return selectedTagsId;
    }

    formToAutocompleteValue(form) {
        let newFormValues = {
            ...form,
            departments: this.getSelectedDepartments(form.departments),
            owners: this.getSelectedStaffs(form.owners),
            tags: this.getSelectedTagsName(form.tags),
        }

        return newFormValues;
    }
}

export default connect((store) => {
    return {
        tags: store.config.tags,
        departments: store.config.departments,
        staffList: store.adminData.staffMembers,
        formState: store.searchFilters.form,
        listDataState: store.searchFilters.listData,
        showFilters: store.searchFilters.showFilters
    };
})(TicketQueryFilters);