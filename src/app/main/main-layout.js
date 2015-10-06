import React              from 'react/addons';
import {RouteHandler}     from 'react-router';

import MainHeader         from 'app/main/main-layout-header';
import MainFooter         from 'app/main/main-layout-footer';

var MainLayout = React.createClass({

    render() {
        return (
            <div className="main-layout">

                <MainHeader />

                {this.props.children}

                <MainFooter />

            </div>
        );
    }
});

export default MainLayout;