const LocalStorageMock = {
    getItem: stub(),
    setItem: stub(),
    removeItem: stub()
};
const date = { getCurrentDate: stub().returns(20160505)};
const sessionStore = requireUnit('lib-app/session-store', {
    'localStorage': LocalStorageMock,
    'lib-app/date': date
});

describe('sessionStore library', function () {

    beforeEach(function () {
        LocalStorageMock.getItem = stub();
        LocalStorageMock.setItem = stub();
        LocalStorageMock.removeItem = stub();
    });

    it('should get, set and remove items from LocalStorage', function () {
        sessionStore.getItem('SOME_KEY');
        expect(LocalStorageMock.getItem).to.have.been.calledWith('SOME_KEY');

        sessionStore.setItem('SOME_KEY', 'SOME_VALUE');
        expect(LocalStorageMock.setItem).to.have.been.calledWith('SOME_KEY', 'SOME_VALUE');

        sessionStore.removeItem('SOME_KEY');
        expect(LocalStorageMock.removeItem).to.have.been.calledWith('SOME_KEY');
    });

    it('should create session correctly', function () {
        sessionStore.createSession(14, 'TOKEN');

        expect(LocalStorageMock.setItem).to.have.been.calledWith('userId', 14);
        expect(LocalStorageMock.setItem).to.have.been.calledWith('token', 'TOKEN');
    });

    it('should return session data', function () {
        LocalStorageMock.getItem = function (key) {
            if (key === 'userId') return 'USER_ID';
            if (key === 'token') return 'TOKEN';
        };
        let sessionData = sessionStore.getSessionData();

        expect(sessionData.userId).to.equal('USER_ID');
        expect(sessionData.token).to.equal('TOKEN');

        LocalStorageMock.getItem = stub().returns('ITEM');
    });

    it('should inform if it is logged in', function () {
        LocalStorageMock.getItem = stub().returns('TOKEN');
        expect(sessionStore.isLoggedIn()).to.equal(true);

        LocalStorageMock.getItem = stub().returns(null);
        expect(sessionStore.isLoggedIn()).to.equal(false);
    });

    it('should clear session data if session is closed', function () {
        sessionStore.closeSession();

        expect(LocalStorageMock.removeItem).to.have.been.calledWith('userId');
        expect(LocalStorageMock.removeItem).to.have.been.calledWith('token');
    });

    it('should store remember data', function () {
        sessionStore.storeRememberData({
            token: 'SOME_TOKEN',
            userId: 12,
            expiration: 20160623
        });

        expect(LocalStorageMock.setItem).to.have.been.calledWith('rememberData-token', 'SOME_TOKEN');
        expect(LocalStorageMock.setItem).to.have.been.calledWith('rememberData-userId', 12);
        expect(LocalStorageMock.setItem).to.have.been.calledWith('rememberData-expiration', 20160623);
    });

    it('should inform if remember expired', function () {
        LocalStorageMock.getItem = (key) => (key === 'rememberData-expiration') ? 20160505 : null;
        date.getCurrentDate.returns(20160506);
        expect(sessionStore.isRememberDataExpired()).to.equal(true);

        LocalStorageMock.getItem = (key) => (key === 'rememberData-expiration') ? 20160505 : null;
        date.getCurrentDate.returns(20160503);
        expect(sessionStore.isRememberDataExpired()).to.equal(false);
    });

    it('should return all remember data', function () {
        LocalStorageMock.getItem = function (key) {
            if (key === 'rememberData-userId') return 'USER_ID';
            if (key === 'rememberData-token') return 'TOKEN';
            if (key === 'rememberData-expiration') return 'EXPIRATION';
        };
        let rememberData = sessionStore.getRememberData();

        expect(rememberData.userId).to.equal('USER_ID');
        expect(rememberData.token).to.equal('TOKEN');
        expect(rememberData.expiration).to.equal('EXPIRATION');

        LocalStorageMock.getItem = stub().returns('ITEM');
    });

    it('should clear remember data', function () {
        sessionStore.clearRememberData();

        expect(LocalStorageMock.removeItem).to.have.been.calledWith('rememberData-userId');
        expect(LocalStorageMock.removeItem).to.have.been.calledWith('rememberData-token');
        expect(LocalStorageMock.removeItem).to.have.been.calledWith('rememberData-expiration');
    });
});