import API from 'lib-app/api-call';
import sessionStore from 'lib-app/session-store';

export default {
    init() {
        if (sessionStore.isLoggedIn()) {
            return {
                type: 'INIT_CONFIGS_FULFILLED',
                payload: {
                    data: sessionStore.getConfigs()
                }
            };
        } else {
            return {
                type: 'INIT_CONFIGS',
                payload: API.call({
                    path: '/system/get-settings',
                    data: {}
                })
            };
        }
    },

    changeLanguage(newLanguage) {
        return {
            type: 'CHANGE_LANGUAGE',
            payload: newLanguage
        };
    },
    
    updateData() {
        return {
            type: 'UPDATE_DATA',
            payload: API.call({
                path: '/system/get-settings',
                data: {}
            })
        };
    }
};