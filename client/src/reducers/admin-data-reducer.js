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
            newTickets: [],
            newTicketsLoaded: false,
            allTickets: [],
            allTicketsLoaded: false
        };
    }

    getTypeHandlers() {
        return {
            'CUSTOM_RESPONSES_FULFILLED': this.onCustomResponses,
            'SESSION_CHECKED': this.onSessionChecked,
            'MY_TICKETS_FULFILLED': this.onMyTicketsRetrieved,
            'MY_TICKETS_PENDING': this.onMyTicketsPending,
            'NEW_TICKETS_FULFILLED': this.onNewTicketsRetrieved,
            'NEW_TICKETS_PENDING': this.onNewTicketsPending,
            'ALL_TICKETS_FULFILLED': this.onAllTicketsRetrieved,
            'ALL_TICKETS_PENDING': this.onAllTicketsPending
        };
    }

    onCustomResponses(state, payload) {
        sessionStore.setItem('customResponses', JSON.stringify(payload.data));

        return _.extend({}, state, {
            customResponses: payload.data,
            customResponsesLoaded: true
        });
    }

    onSessionChecked(state) {
        const customResponses = sessionStore.getItem('customResponses');

        return _.extend({}, state, {
            customResponses: JSON.parse(customResponses),
            customResponsesLoaded: true
        });
    }

    onMyTicketsRetrieved(state, payload) {
        return _.extend({}, state, {
            myTickets: payload.data,
            myTicketsLoaded: true
        })
    }

    onMyTicketsPending(state) {
        return _.extend({}, state, {
            myTicketsLoaded: false
        })
    }

    onNewTicketsRetrieved(state, payload) {
        return _.extend({}, state, {
            newTickets: payload.data,
            newTicketsLoaded: true
        })
    }

    onNewTicketsPending(state) {
        return _.extend({}, state, {
            newTicketsLoaded: false
        })
    }

    onAllTicketsRetrieved(state, payload) {
        return _.extend({}, state, {
            allTickets: payload.data.tickets,
            allTicketsPages: payload.data.pages,
            allTicketsLoaded: true
        })
    }

    onAllTicketsPending(state) {
        return _.extend({}, state, {
            allTicketsLoaded: false
        })
    }
}

export default AdminDataReducer.getInstance();