import React              from 'react/addons';

import Widget             from 'core-components/widget';
import Input              from 'core-components/input';
import Button             from 'core-components/button';

var MainHomePageLoginWidget = React.createClass({
    render() {
        return (
            <Widget>
                <h3>Login</h3>

                <Input placeholder="email" />
                <Input placeholder="password" />

                <Button type="primary">LOG IN</Button>
            </Widget>
        );
    }
});

export default MainHomePageLoginWidget;