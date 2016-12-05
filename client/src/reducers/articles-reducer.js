import _ from 'lodash';

import Reducer from 'reducers/reducer';
import SessionStore from 'lib-app/session-store';

class ArticlesReducer extends Reducer {

    getInitialState() {
        return {
            retrieved: false,
            loading: true,
            topics: []
        };
    }

    getTypeHandlers() {
        return {
            'GET_ARTICLES_FULFILLED': this.onArticlesRetrieved,
            'INIT_ARTICLES': this.onInitArticles
        };
    }

    onArticlesRetrieved(state, payload) {
        SessionStore.setItem('topics', JSON.stringify(payload.data));

        return _.extend({}, state, {
            retrieved: true,
            loading: false,
            topics: payload.data
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