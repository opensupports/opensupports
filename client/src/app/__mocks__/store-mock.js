export default {
    dispatch: stub().returns(new Promise(r => r())),
    getState: stub().returns({
        config: {},
        session: {},
        routing: {}
    })
};