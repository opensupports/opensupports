import _ from 'lodash';

import Reducer from 'reducers/reducer';

class AdminDataReducer extends Reducer {

    getInitialState() {
        return {
            myTickets: [],
            myTicketsLoaded: false,
            customResponses: [],
            customResponsesLoaded: false
        };
    }

    getTypeHandlers() {
        return {
            'CUSTOM_RESPONSES_FULFILLED': this.onCustomResponses,
            'MY_TICKETS_FULFILLED': this.onMyTicketsRetrieved,
            'MY_TICKETS_PENDING': this.onMyTicketsPending
        };
    }

    onCustomResponses(state, payload) {
        return _.extend({}, state, {
            customResponses: payload.data,
            customResponsesLoaded: true
        });
    }

    onMyTicketsRetrieved(state, payload) {
        return _.extend({}, state, {
            myTickets: payload.data,
            customResponsesLoaded: true
        })
    }

    onMyTicketsPending(state) {
        return _.extennd({}, state, {
            myTicketsLoaded: true
        })
    }
}

export default AdminDataReducer.getInstance();