export default {
    createSession: stub(),
    getSessionData: stub().returns({}),
    isLoggedIn: stub().returns(false),
    closeSession: stub()
};