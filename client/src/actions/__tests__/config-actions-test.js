const sessionStoreMock = require('lib-app/__mocks__/session-store-mock');
const APICallMock = {
    call: stub().returns('API_RESULT')
};

const ConfigActions = requireUnit('actions/config-actions', {
    'lib-app/api-call': APICallMock,
    'lib-app/session-store': sessionStoreMock
});

describe('Config Actions,', function () {

    describe('init action', function () {
        it('should return INIT_CONFIGS_FULFILLED with configs if it user is logged in', function () {
            sessionStoreMock.isLoggedIn.returns(true);
            sessionStoreMock.getConfigs.returns({
                config1: 'CONFIG_1',
                config2: 'CONFIG_2'
            });

            expect(ConfigActions.init()).to.deep.equal({
                type: 'INIT_CONFIGS_FULFILLED',
                payload: {
                    data: {
                        config1: 'CONFIG_1',
                        config2: 'CONFIG_2'
                    }
                }
            })
        });

        it('should return INIT_CONFIGS with API_RESULT if it is not retrieved', function () {
            APICallMock.call.reset();
            sessionStoreMock.isLoggedIn.returns(false);
            sessionStoreMock.getConfigs.returns({
                config1: 'CONFIG_1',
                config2: 'CONFIG_2'
            });

            expect(ConfigActions.init()).to.deep.equal({
                type: 'INIT_CONFIGS',
                payload: 'API_RESULT'
            });
            expect(APICallMock.call).to.have.been.calledWith({
                path: '/system/get-settings',
                data: {}
            });
        });
    });

    describe('changeLanguage action', function () {
        it('should trigger CHANGE_LANGUAGE with new language', function () {
            expect(ConfigActions.changeLanguage('es')).to.deep.equal({
                type: 'CHANGE_LANGUAGE',
                payload: 'es'
            });

            expect(ConfigActions.changeLanguage('de')).to.deep.equal({
                type: 'CHANGE_LANGUAGE',
                payload: 'de'
            });
        });
    });
});