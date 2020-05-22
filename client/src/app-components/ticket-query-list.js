import React from 'react';
import _ from 'lodash';

import API from 'lib-app/api-call';
import i18n from 'lib-app/i18n';
import {connect}  from 'react-redux';

import TicketList from 'app-components/ticket-list';
import Message from 'core-components/message';
import searchFiltersActions from '../actions/search-filters-actions';

class TicketQueryList extends React.Component {

    state = {
        tickets: [],
        page: 1,
        pages: 0,
        error: null,
        loading: true
    };

    componentDidMount() {
        this.getTickets();
    }

    componentWillReceiveProps(nextProps) {
        this.getTickets(nextProps.listDataState.filters);
    }

    render() {
        return (
            <div>
                {
                    (this.state.error) ?
                    <Message type="error">{i18n('ERROR_RETRIEVING_TICKETS')}</Message> :
                    <TicketList {...this.getTicketListProps()}/>
                }
            </div>
        );
    }

    getTickets(filters) {
        this.setState({
            loading:true
        })
        API.call({
            path: '/ticket/search',
            data: filters
        }).then((result) => {
            this.setState({
                tickets: result.data.tickets,
                page: result.data.page,
                pages: result.data.pages,
                error: null,
                loading: false
            })
        }).catch((result) => this.setState({
            loading: false,
            error: result.message
        }));

    }

    onPageChange(event) {
        const {
            dispatch,
            listDataState
        } = this.props;

        this.setState({
            page: event.target.value
        });

        dispatch(searchFiltersActions.changeFilters({
            ...listDataState,
            filters: {
                ...listDataState.filters,
                page: JSON.stringify(event.target.value)
            },
            filtersNoChangeAuthors: true
        }));
    }

    getTicketListProps () {
        const {
            page,
            pages,
            loading,
            tickets
        } = this.state;
        const {
            listDataState,
            onChangeOrderBy,
            userId
        } = this.props;

        return {
            userId: userId,
            ticketPath: '/admin/panel/tickets/view-ticket/',
            tickets,
            page,
            pages,
            loading,
            type: 'secondary',
            showDepartmentDropdown: false,
            closedTicketsShown: false,
            onPageChange:this.onPageChange.bind(this),
            orderBy: listDataState.filters.orderBy ? JSON.parse(listDataState.filters.orderBy) : listDataState.filters.orderBy,
            showOrderArrows: true,
            onChangeOrderBy: onChangeOrderBy,
        };
    }

}

export default connect((store) => {
    return {
        userId: store.session.userId*1
    };
})(TicketQueryList);
