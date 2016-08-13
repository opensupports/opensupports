import API from 'lib-app/api-call';
import sessionStore from 'lib-app/session-store';

export default {
    init() {
        if (sessionStore.areConfigsStored()) {
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
                    path: '/system/get-configs',
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
    }
};