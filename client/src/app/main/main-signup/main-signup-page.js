import React              from 'react';
import ReactDOM           from 'react-dom';

import Widget             from 'core-components/widget';
import MainSignUpWidget   from 'app/main/main-signup/main-signup-widget';

class MainSignUpPage extends React.Component {

    render() {
        return (
            <div className="main-signup-page">
                <MainSignUpWidget {...this.props} className="col-md-6 col-md-offset-3" />
            </div>
        );
    }
}

export default MainSignUpPage;
