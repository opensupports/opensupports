const Reducer = require('reducers/reducer');


class SomeReducer extends Reducer {
    getTypeHandlers() {
        return {
            'ACTION_1': this.handleAction1
        };
    }
    
    getInitialState() {
        return {
            prop1: 0,
            prop2: '',
            prop3: false
        };
    }

    handleAction1(state, payload) {
        return {
            state: state,
            payload: payload,
            prop1: 5,
            prop2: 'hello',
            prop3: true
        };
    }
}

describe('Reducer class', function () {
    let reducer;
    
    before(function () {
        reducer = SomeReducer.getInstance();
    });
    
    it('should call correct handlers for each type', function () {
        let result = reducer(undefined, {});
        expect(result).to.deep.equal({
            prop1: 0,
            prop2: '',
            prop3: false
        });

        result = reducer({prop4: true}, {type: 'ACTION_1', payload: 'PAYLOAD'});
        expect(result).to.deep.equal({
            state: {
                prop4: true
            },
            payload: 'PAYLOAD',
            prop1: 5,
            prop2: 'hello',
            prop3: true
        });
    });
});