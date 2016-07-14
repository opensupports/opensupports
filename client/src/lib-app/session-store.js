import SessionStorage from 'sessionstorage';


class SessionStore {
    static initialize() {
        if (!SessionStorage.getItem('language')) {
            SessionStorage.setItem('language', 'english');
        }
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