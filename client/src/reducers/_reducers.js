import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import sessionReducer from 'reducers/session-reducer';
import configReducer from 'reducers/config-reducer';

export default combineReducers({
    session: sessionReducer,
    config: configReducer,
    routing: routerReducer
});