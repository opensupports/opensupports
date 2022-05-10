import React from 'react';
import _ from 'lodash';
import {connect}  from 'react-redux';

import SearchFiltersActions from 'actions/search-filters-actions';

import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';
import history from 'lib-app/history';
import searchTicketsUtils from 'lib-app/search-tickets-utils';
import ticketUtils from 'lib-app/ticket-utils';

import Form from 'core-components/form';
import SubmitButton from 'core-components/submit-button';
import FormField from 'core-components/form-field';
import Icon from 'core-components/icon';
import Button from 'core-components/button';
import Loading from 'core-components/loading';


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

    render() {
        const {
            formState,
            filters,
            showFilters,
            ticketQueryListState,
            staffList
        } = this.props;

        return (
            <div className={"ticket-query-filters" + (showFilters ? "__open" : "") }>
                <Form
                    loading={ticketQueryListState.loading}
                    values={this.getFormValue(formState)}
                    onChange={this.onChangeForm.bind(this)}
                    onSubmit={this.onSubmitListConfig.bind(this)}>
                    <div className="ticket-query-filters__search-box">
                        <FormField name="query" field="search-box" fieldProps={{onSearch: this.onSubmitListConfig.bind(this)}} />
                    </div>
                    <div className="ticket-query-filters__second-row">
                        <FormField
                            label={i18n('PERIOD')}
                            name="period"
                            field="select"
                            fieldProps={{
                                items: [{content: i18n('LAST_7_DAYS')}, {content: i18n('LAST_30_DAYS')}, {content: i18n('LAST_90_DAYS')}, {content: i18n('LAST_365_DAYS')}],
                                className: 'ticket-query-filters__drop-down'
                            }} />
                        <FormField
                            label={i18n('DEPARTMENTS')}
                            name="departments"
                            field="autocomplete"
                            fieldProps={{items: this.getDepartmentsItems()}} />
                        <FormField
                            label={i18n('OWNER')}
                            name="owners"
                            field="autocomplete"
                            fieldProps={{items: ticketUtils.getStaffList({staffList}, 'toAutocomplete')}} />
                    </div>
                    <div className="ticket-query-filters__third-row">
                        <FormField
                            label={i18n('STATUS')}
                            name="closed"
                            field="select"
                            fieldProps={{
                                items: this.getStatusItems(),
                                className: 'ticket-query-filters__drop-down'
                            }} />
                        <FormField
                            label={i18n('TAGS')}
                            name="tags"
                            field="tag-selector"
                            fieldProps={{
                                items: this.getTags(filters.tags),
                                onRemoveClick: this.removeTag.bind(this),
                                onTagSelected: this.addTag.bind(this)
                            }} />
                        <FormField
                            label={i18n('AUTHORS')}
                            name="authors"
                            field="autocomplete"
                            fieldProps={{
                                getItemListFromQuery: this.searchAuthors.bind(this),
                                comparerFunction: this.autorsComparer.bind(this)
                            }} />
                    </div>
                    <div className="ticket-query-filters__container">
                        <Button
                            className="ticket-query-filters__container__button ticket-query-filters__container__clear-button"
                            size= "medium"
                            disabled={ticketQueryListState.loading}
                            onClick={this.clearFormValues.bind(this)}>
                                {ticketQueryListState.loading ? <Loading /> : i18n('CLEAR')}
                        </Button>
                        <SubmitButton
                            className="ticket-query-filters__container__button ticket-query-filters__container__search-button"
                            type="secondary"
                            size= "medium">
                                {i18n('SEARCH')}
                        </SubmitButton>
                    </div>
                </Form>
                <span className="separator" />
            </div>
        );
    }

    searchAuthors(query, blacklist = []) {
        blacklist = blacklist.map(item => {return {isStaff: item.isStaff, id: item.id}});

        return API.call({
            path: '/ticket/search-authors',
            data: {
                query: query,
                blackList: JSON.stringify(blacklist)
            }
        }).then(r => {
            return r.data.authors.map(author => {
                return {
                    name: author.name,
                    color: "gray",
                    id: author.id*1,
                    profilePic: author.profilePic,
                    isStaff: author.isStaff * 1,
                    content: author.profilePic !== undefined ? ticketUtils.renderStaffOption(author) : author.name,
                    contentOnSelected: author.profilePic !== undefined ? ticketUtils.renderStaffSelected(author) : author.name
                }});
        });
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

    addTag(tag) {
        const { formState } = this.props;
        this.onChangeFormState({...formState, tags: [...formState.tags, tag]});
    }

    autorsComparer(autorList, autorSelectedList) {
        return autorList.filter(item  => !_.some(autorSelectedList, {id: item.id, isStaff: item.isStaff}));
    }

    clearFormValues(event) {
        event.preventDefault();
        this.props.dispatch(SearchFiltersActions.setDefaultFormValues());
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

    getSelectedDepartments(selectedDepartmentsId) {
        let selectedDepartments = [];

        if(selectedDepartmentsId !== undefined) {
            selectedDepartments = selectedDepartmentsId.map(
                (departmentId) => this.getDepartmentsItems().find(_department => (_department.id === departmentId))
            );

        }

        return selectedDepartments;
    }

    getSelectedStaffs(selectedStaffsId) {
        const { staffList } = this.props;
        let selectedStaffs = [];

        if(selectedStaffsId !== undefined) {
            selectedStaffs = selectedStaffsId.map(
                (staffId) => ticketUtils.getStaffList({staffList}, 'toAutocomplete').find(_staff => (_staff.id === staffId))
            );
        }

        return selectedStaffs;
    }

    getSelectedTagsName(selectedTagsId) {
        let selectedTagsName = [];

        if(selectedTagsId !== undefined) {
            selectedTagsName = selectedTagsId.map(
                (tagId) => (this.getTags().find(_tag => (_tag.id === tagId)) || {}).name
            );
        }

        return selectedTagsName;
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

    onChangeFormState(formValues) {
        this.props.dispatch(SearchFiltersActions.changeForm(formValues));
    }

    onSubmitListConfig() {
        const {
            formState,
            filters,
            formEdited,
        } = this.props;
        const listConfigWithCompleteAuthorsList = searchTicketsUtils.formValueToListConfig(
            {...formState, orderBy: filters.orderBy, page: 1},
            true
        );

        if(formEdited) {
            const filtersForAPI = searchTicketsUtils.getFiltersForAPI(listConfigWithCompleteAuthorsList.filters);
            const currentPath = window.location.pathname;
            const urlQuery = searchTicketsUtils.getFiltersForURL({
                filters: filtersForAPI,
                shouldRemoveCustomParam: true,
                shouldRemoveUseInitialValuesParam: true
            });
            urlQuery && history.push(`${currentPath}${urlQuery}`);
        }
    }

    removeTag(tag) {
        const { formState } = this.props;

        this.onChangeFormState({...formState, tags: formState.tags.filter(item => item !== tag)});
    }

    tagsNametoTagsId(selectedTagsName) {
        let selectedTagsId = [];

        if (selectedTagsName != undefined) {
            selectedTagsId = selectedTagsName.map(
                (tagName) => (this.getTags().find(_tag => (_tag.name === tagName)) || {}).id
            );
        }

        return selectedTagsId;
    }

    onChangeForm(data) {
        const departmentsId = data.departments.map(department => department.id);
        const staffsId = data.owners.map(staff => staff.id);
        const tagsName = this.tagsNametoTagsId(data.tags);
        const authors = data.authors.map(({name, id, isStaff, profilePic, color}) => ({name, id: id*1, isStaff, profilePic, color}));

        this.onChangeFormState({
            ...data,
            tags: tagsName,
            owners: staffsId,
            departments: departmentsId,
            authors: authors,
        });
    }

    getFormValue(form) {
        return {
            ...form,
            departments: this.getSelectedDepartments(form.departments),
            owners: this.getSelectedStaffs(form.owners),
            tags: this.getSelectedTagsName(form.tags),
            authors: this.getAuthors(form.authors),
        }
    }

    getAuthors(authors = []) {
        return authors.map(author => ({
            name: author.name,
            color: "gray",
            id: author.id*1,
            isStaff: author.isStaff*1,
            profilePic: author.profilePic,
            content: author.profilePic !== undefined ? ticketUtils.renderStaffOption(author) : author.name,
            contentOnSelected: author.profilePic !== undefined ? ticketUtils.renderStaffSelected(author) : author.name
        }));
    }

}

export default connect((store) => {
    return {
        tags: store.config.tags,
        departments: store.config.departments,
        staffList: store.adminData.staffMembers,
        formState: store.searchFilters.form,
        filters: store.searchFilters.listConfig.filters,
        showFilters: store.searchFilters.showFilters,
        formEdited: store.searchFilters.formEdited,
        ticketQueryListState: store.searchFilters.ticketQueryListState,
    };
})(TicketQueryFilters);
