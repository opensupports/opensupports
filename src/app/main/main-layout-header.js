import React              from 'react/addons';
import Button             from 'core-components/button';

var MainLayoutHeader = React.createClass({

    render() {
        return (
            <div className="main-layout-header">
                <div className="main-layout-header--login-links">
                   <Button type="light">Sign up</Button>
                </div>
            </div>
        );
    }
});

export default MainLayoutHeader;