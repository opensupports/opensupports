import LocalStorage from 'localStorage';
import date from 'lib-app/date';

class SessionStore {
    constructor() {
        this.storage = LocalStorage;
    }

    createSession(userId, token) {
        this.setItem('userId', userId);
        this.setItem('token', token);
    }

    getSessionData() {
        return {
            userId: this.getItem('userId'),
            token: this.getItem('token')
        };
    }

    isLoggedIn() {
        return !!this.getItem('userId');
    }

    closeSession() {
        this.removeItem('userId');
        this.removeItem('token');

        this.clearRememberData();
        this.clearUserData();
    }

    storeUserData(data) {
        this.setItem('userData', JSON.stringify(data));
    }

    getUserData() {
        return JSON.parse(this.getItem('userData'));
    }

    getDepartments() {
        return JSON.parse(this.getItem('departments'));
    }

    storeRememberData({token, userId, expiration}) {
        this.setItem('rememberData-token', token);
        this.setItem('rememberData-userId', userId);
        this.setItem('rememberData-expiration', expiration);
    }

    storeConfigs(configs) {
        this.setItem('session-prefix', configs['session-prefix']);
        this.setItem('language', configs.language);
        this.setItem('reCaptchaKey', configs.reCaptchaKey);
        this.setItem('departments', JSON.stringify(configs.departments));
        this.setItem('allowedLanguages', JSON.stringify(configs.allowedLanguages));
        this.setItem('supportedLanguages', JSON.stringify(configs.supportedLanguages));
        this.setItem('layout', configs.layout);
        this.setItem('title', configs.title);
        this.setItem('registration', configs.registration);
        this.setItem('user-system-enabled', configs['user-system-enabled']);
        this.setItem('allow-attachments', configs['allow-attachments']);
        this.setItem('maintenance-mode', configs['maintenance-mode']);
    }

    getConfigs() {
        return {
            language: this.getItem('language'),
            reCaptchaKey: this.getItem('reCaptchaKey'),
            departments: this.getDepartments() || [],
            allowedLanguages: JSON.parse(this.getItem('allowedLanguages')),
            supportedLanguages: JSON.parse(this.getItem('supportedLanguages')),
            layout: this.getItem('layout'),
            title: this.getItem('title'),
            registration: (this.getItem('registration') * 1),
            'user-system-enabled': (this.getItem('user-system-enabled') * 1),
            'allow-attachments': (this.getItem('allow-attachments') * 1),
            'maintenance-mode': (this.getItem('maintenance-mode') * 1)
        };
    }

    isRememberDataExpired() {
        let rememberData = this.getRememberData();

        return rememberData.expiration < date.getCurrentDate();
    }

    getRememberData() {
        return {
            token: this.getItem('rememberData-token'),
            userId: this.getItem('rememberData-userId'),
            expiration: this.getItem('rememberData-expiration')
        };
    }

    clearRememberData() {
        this.removeItem('rememberData-token');
        this.removeItem('rememberData-userId');
        this.removeItem('rememberData-expiration');
    }

    clearUserData() {
        this.removeItem('userData');
    }

    getItem(key) {
        return this.storage.getItem(root + '_' + key);
    }

    setItem(key, value) {
        return this.storage.setItem(root + '_' + key, (value !== undefined) ? value : '');
    }

    removeItem(key) {
        this.storage.removeItem(root + '_' + key);
    }
}

export default new SessionStore();
