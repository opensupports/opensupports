import LocalStorage from 'localStorage';

class LocalStore {

    constructor() {
        this.storage  = LocalStorage;
    }

    initialize() {
        if (this.isRememberDataExpired()) {
            this.clearRememberData();
        }

        if (!this.getItem('language')) {
            this.setItem('language', 'english');
        }
    }

    storeRememberData({token, userId, expiration}) {
        this.setItem('rememberData-token', token);
        this.setItem('rememberData-userId', userId);
        this.setItem('rememberData-expiration', expiration);
    }

    isRememberDataExpired() {
        let rememberData = this.getRememberData();

        return rememberData.expiration < 2016;
    }

    getRememberData() {
        return {
            token: this.getItem('rememberData-token'),
            userId: parseInt(this.getItem('rememberData-userId')),
            expiration: parseInt(this.getItem('rememberData-expiration'))
        };
    }

    clearRememberData() {
        this.setItem('rememberData-token', null);
        this.setItem('rememberData-userId', null);
        this.setItem('rememberData-expiration', null);
    }

    getItem(key) {
        return this.storage.getItem(key);
    }

    setItem(key, value) {
        return this.storage.setItem(key, value);
    }
}

export default new LocalStore();