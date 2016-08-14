export default {
    createSession: stub(),
    getSessionData: stub().returns({}),
    clearRememberData: stub(),
    storeRememberData: stub(),
    getRememberData: stub(),
    isRememberDataExpired: stub().returns(false),
    isLoggedIn: stub().returns(false),
    setConfigs: stub().returns(false),
    getConfigs: stub().returns({}),
    areConfigsStored: stub().returns(false),
    closeSession: stub()
};