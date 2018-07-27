import _ from 'lodash';

import Reducer from 'reducers/reducer';
import sessionStore from 'lib-app/session-store';

class AdminDataReducer extends Reducer {

    getInitialState() {
        return {
            customResponses: [],
            customResponsesLoaded: false,

            myTickets: [],
            myTicketsLoaded: false,
            myTicketsError: false,

            newTickets: [],
            newTicketsLoaded: false,
            newTicketsError: false,

            allTickets: [],
            allTicketsLoaded: false,
            allTicketsError: false,

            staffMembers: [],
            staffMembersLoaded: false,
            staffMembersError: false,
        };
    }

    getTypeHandlers() {
        return {
            'CUSTOM_RESPONSES_FULFILLED': this.onCustomResponses,

            'MY_TICKETS_FULFILLED': this.onMyTicketsRetrieved,
            'MY_TICKETS_REJECTED': this.onMyTicketsRejected,
            'MY_TICKETS_PENDING': this.onMyTicketsPending,

            'NEW_TICKETS_FULFILLED': this.onNewTicketsRetrieved,
            'NEW_TICKETS_REJECTED': this.onNewTicketsRejected,
            'NEW_TICKETS_PENDING': this.onNewTicketsPending,

            'ALL_TICKETS_FULFILLED': this.onAllTicketsRetrieved,
            'ALL_TICKETS_REJECTED': this.onAllTicketsRejected,
            'ALL_TICKETS_PENDING': this.onAllTicketsPending,

            'STAFF_MEMBERS_FULFILLED': this.onStaffMembersRetrieved,
            'STAFF_MEMBERS_REJECTED': this.onStaffMembersRejected,
            'STAFF_MEMBERS_PENDING': this.onStaffMembersPending
        };
    }

    onCustomResponses(state, payload) {
        sessionStore.setItem('customResponses', JSON.stringify(payload.data));

        return _.extend({}, state, {
            customResponses: payload.data,
            customResponsesLoaded: true
        });
    }

    onMyTicketsRetrieved(state, payload) {
        return _.extend({}, state, {
            myTickets: payload.data,
            myTicketsLoaded: true
        });
    }

    onMyTicketsRejected(state) {
        return _.extend({}, state, {
            myTicketsError: true,
            myTicketsLoaded: true
        })
    }

    onMyTicketsPending(state) {
        return _.extend({}, state, {
            myTicketsError: false,
            myTicketsLoaded: false
        });
    }

    onNewTicketsRetrieved(state, payload) {
        return _.extend({}, state, {
            newTickets: payload.data,
            newTicketsLoaded: true
        });
    }

    onNewTicketsRejected(state) {
        return _.extend({}, state, {
            newTicketsError: true,
            newTicketsLoaded: false
        });
    }

    onNewTicketsPending(state) {
        return _.extend({}, state, {
            newTicketsError: false,
            newTicketsLoaded: false
        });
    }

    onAllTicketsRetrieved(state, payload) {
        return _.extend({}, state, {
            allTickets: payload.data.tickets,
            allTicketsPages: payload.data.pages,
            allTicketsLoaded: true
        });
    }

    onAllTicketsRejected(state) {
        return _.extend({}, state, {
            allTicketsError: true,
            allTicketsLoaded: false
        });
    }

    onAllTicketsPending(state) {
        return _.extend({}, state, {
            allTicketsError: false,
            allTicketsLoaded: false
        });
    }

    onStaffMembersRetrieved(state, payload) {
        return _.extend({}, state, {
            staffMembers: payload.data,
            staffMembersLoaded: true
        });
    }

    onStaffMembersRejected(state) {
        return _.extend({}, state, {
            staffMembersError: true,
            staffMembersLoaded: false
        });
    }

    onStaffMembersPending(state) {
        return _.extend({}, state, {
            staffMembersError: false,
            staffMembersLoaded: false
        });
    }
}

export default AdminDataReducer.getInstance();
