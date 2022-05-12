import LocalStorage from 'localStorage';
import date from 'lib-app/date';

class SessionStore {
    constructor() {
        this.storage = LocalStorage;
    }

    createSession(userId, token, ticketNumber = '') {
        this.setItem('userId', userId);
        this.setItem('token', token);
        this.setItem('ticketNumber', ticketNumber);
    }

    getSessionData() {
        return {
            userId: this.getItem('userId'),
            token: this.getItem('token')
        };
    }

    isLoggedIn() {
        return !!this.getItem('userId') && !this.getItem('ticketNumber');
    }

    isLoggedInWithTicket() {
      return !!this.getItem('userId') && this.getItem('ticketNumber');
    }

    closeSession() {
        this.removeItem('userId');
        this.removeItem('token');
        this.removeItem('ticketNumber');

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

    getCustomFields() {
        return JSON.parse(this.getItem('customFields'));
    }

    storeRememberData({token, userId, expiration, isStaff}) {
        this.setItem('rememberData-token', token);
        this.setItem('rememberData-userId', userId);
        this.setItem('rememberData-isStaff', isStaff);
        this.setItem('rememberData-expiration', expiration);
    }

    storeCustomField(customFields) {
        this.setItem('customFields', JSON.stringify(customFields));
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
        this.setItem('mandatory-login', configs['mandatory-login']);
        this.setItem('allow-attachments', configs['allow-attachments']);
        this.setItem('maintenance-mode', configs['maintenance-mode']);
        this.setItem('max-size', configs['max-size']);
        this.setItem('tags', JSON.stringify(configs['tags']));
        this.setItem('default-is-locked', configs['default-is-locked']);
        this.setItem('default-department-id',  configs['default-department-id']);
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
            'mandatory-login': (this.getItem('mandatory-login') * 1),
            'allow-attachments': (this.getItem('allow-attachments') * 1),
            'maintenance-mode': (this.getItem('maintenance-mode') * 1),
            'max-size': this.getItem('max-size'),
            'tags': JSON.parse(this.getItem('tags')),
            'default-is-locked': this.getItem('default-is-locked'),
            'default-department-id':  this.getItem('default-department-id')
            
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
            isStaff: this.getItem('rememberData-isStaff'),
            expiration: this.getItem('rememberData-expiration')
        };
    }

    clearRememberData() {
        this.removeItem('rememberData-token');
        this.removeItem('rememberData-userId');
        this.removeItem('rememberData-isStaff');
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
