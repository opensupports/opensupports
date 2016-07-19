import LocalStorage from 'localstorage';

class LocalStore {

    constructor() {
        this.setItem = LocalStorage.setItem;
        this.getItem = LocalStorage.getItem;
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
        this.setItem('rememberData', {
            token,
            userId,
            expiration
        });
    }

    isRememberDataExpired() {
        let rememberData = this.getItem('rememberData');

        return rememberData && rememberData.expirationDate > 2016
    }

    clearRememberData() {
        this.setItem('rememberData', null);
    }
}

export default new LocalStore();