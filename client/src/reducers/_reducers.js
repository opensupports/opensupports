import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import sessionReducer from 'reducers/session-reducer';
import configReducer from 'reducers/config-reducer';
import modalReducer from 'reducers/modal-reducer';
import articlesReducer from 'reducers/articles-reducer';
import adminDataReducer from 'reducers/admin-data-reducer';
import searchFiltersReducer from 'reducers/search-filters-reducer';
import loginFormReducer from 'reducers/login-form-reducer';

export default combineReducers({
    session: sessionReducer,
    config: configReducer,
    loginForm: loginFormReducer,
    modal: modalReducer,
    articles: articlesReducer,
    adminData: adminDataReducer,
    routing: routerReducer,
    searchFilters: searchFiltersReducer,
});