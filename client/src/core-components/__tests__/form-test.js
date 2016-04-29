/*
jest.dontMock('core-components/form.js');
jest.dontMock('core-components/form.js');

import React from 'react';
import Form from 'core-components/form.js';
import Input from 'core-components/input.js';

let TestUtils = React.addons.TestUtils;

describe('Form', function () {
    let results = TestUtils.renderIntoDocument(
        <Form onSubmit={jest.genMockFunction()}>
            <div>
                <Input name="first" value="value1"/>
                <Input name="second" value="value2" />
            </div>
            <Input name="third" value="value3" />
        </Form>
    );
    let inputs = TestUtils.scryRenderedComponentsWithType(results, Input);

    it('should store input value in form state', function () {
        expect(results.state.form).toEqual({
            first: 'value1',
            second: 'value2',
            third: 'value3'
        });
    });

    it('should update form state if an input value changes', function () {
        inputs[0].props.onChange({ target: {value: 'value4'}});

        expect(results.state.form).toEqual({
            first: 'value4',
            second: 'value2',
            third: 'value3'
        });
    });

    it('should update input value if state value changes', function () {
        results.setState({
            form: {
                first: 'value6',
                second: 'value7',
                third: 'value8'
            }
        });

        expect(inputs[0].props.value).toEqual('value6');
        expect(inputs[1].props.value).toEqual('value7');
        expect(inputs[2].props.value).toEqual('value8');
    });

    it('should call onSubmit callback when form is submitted', function () {
        TestUtils.Simulate.submit(results.getDOMNode());

        expect(results.props.onSubmit).toBeCalledWith(results.state.form);
    });
});
*/