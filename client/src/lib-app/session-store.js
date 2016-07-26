import LocalStorage from 'localStorage';
import date from 'lib-app/date';

class SessionStore {
    constructor() {
        this.storage = LocalStorage;

        if (!this.getItem('language')) {
            this.setItem('language', 'english');
        }
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
        return !!this.getItem('token');
    }

    closeSession() {
        this.removeItem('userId');
        this.removeItem('token');
    }

    storeRememberData({token, userId, expiration}) {
        this.setItem('rememberData-token', token);
        this.setItem('rememberData-userId', userId);
        this.setItem('rememberData-expiration', expiration);
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

    getItem(key) {
        return this.storage.getItem(key);
    }

    setItem(key, value) {
        return this.storage.setItem(key, value);
    }

    removeItem(key) {
        this.storage.removeItem(key);
    }
}

export default new SessionStore();