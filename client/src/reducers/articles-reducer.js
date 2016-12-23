import _ from 'lodash';

import Reducer from 'reducers/reducer';
import SessionStore from 'lib-app/session-store';

class ArticlesReducer extends Reducer {

    getInitialState() {
        return {
            retrieved: false,
            loading: true,
            errored: false,
            topics: []
        };
    }

    getTypeHandlers() {
        return {
            'GET_ARTICLES_FULFILLED': this.onArticlesRetrieved,
            'GET_ARTICLES_REJECTED': this.onArticlesRejected,
            'INIT_ARTICLES': this.onInitArticles
        };
    }

    onArticlesRetrieved(state, payload) {
        SessionStore.setItem('topics', JSON.stringify(payload.data));

        return _.extend({}, state, {
            retrieved: true,
            loading: false,
            errored: false,
            topics: payload.data
        });
    }

    onArticlesRejected(state) {
        return _.extend({}, state, {
            retrieved: true,
            loading: false,
            errored: true
        });
    }

    onInitArticles(state) {
        let topics = SessionStore.getItem('topics');

        if(topics) {
            topics = JSON.parse(topics);
        }

        return _.extend({}, state, {
            retrieved: !!topics,
            loading: false,
            topics: topics
        });
    }
}

export default ArticlesReducer.getInstance();