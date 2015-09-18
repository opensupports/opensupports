import React              from 'react/addons';

import Form               from 'core-components/form';
import Widget             from 'core-components/widget';
import Input              from 'core-components/input';
import Button             from 'core-components/button';

var MainHomePageLoginWidget = React.createClass({
    render() {
        return (
            <Widget className="main-home-page--widget">
                <h3>Login</h3>
                <Form>
                    <div>
                        <Input placeholder="email" name="email" />
                    </div>
                    <Input placeholder="password" name="password" />

                    <Button type="primary">LOG IN</Button>
                </Form>
            </Widget>
        );
    }
});

export default MainHomePageLoginWidget;