import SessionStorage from 'sessionstorage';
import LocalStore from 'lib-app/local-store';

class SessionStore {
    static initialize() {

    }

    static createSession(userId, token) {
        SessionStorage.setItem('userId', userId);
        SessionStorage.setItem('token', token);
    }

    static getSessionData() {
        return {
            userId: SessionStorage.getItem('userId'),
            token: SessionStorage.getItem('token')
        };
    }

    static isLoggedIn() {
        return !!SessionStorage.getItem('userId');
    }

    static closeSession() {
        SessionStorage.removeItem('userId');
        SessionStorage.removeItem('token');
    }
}

SessionStore.initialize();

export default SessionStore;