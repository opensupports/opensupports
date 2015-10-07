import React              from 'react/addons';
import {RouteHandler}     from 'react-router';
import MainHomePageLoginWidget  from 'app/main/main-home/main-home-page-login-widget';

var MainSignUpPage = React.createClass({

    render() {
        return (
            <div className="main-home-page">
                This is the sign up page
                <MainHomePageLoginWidget />
            </div>
        );
    }
});

export default MainSignUpPage;