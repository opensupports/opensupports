export default {
    dispatch: stub(),
    getState: stub().returns({
        config: {},
        session: {},
        routing: {}
    })
};