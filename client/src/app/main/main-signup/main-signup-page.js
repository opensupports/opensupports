import React              from 'react';

import MainSignUpWidget   from 'app/main/main-signup/main-signup-widget';

class MainSignUpPage extends React.Component {

    render() {
        return (
            <div className="main-signup-page">
                <MainSignUpWidget className="col-md-6 col-md-offset-3" />
            </div>
        );
    }
}

export default MainSignUpPage;
