import SessionStorage from 'sessionstorage';

class SessionStore {
    constructor() {
        this.storage = SessionStorage;
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
    }

    getItem(key) {
        return this.storage.getItem(key);
    }

    setItem(key, value) {
        return this.storage.setItem(key, value);
    }

    removeItem(key) {
        return this.storage.removeItem(key);
    }
}

export default new SessionStore();