import _ from 'lodash';

import Reducer from 'reducers/reducer';
import sessionStore from 'lib-app/session-store';

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
            'SESSION_CHECKED': this.onSessionChecked
            'MY_TICKETS_FULFILLED': this.onMyTicketsRetrieved,
            'MY_TICKETS_PENDING': this.onMyTicketsPending
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