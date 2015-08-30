import React              from 'react/addons';
import {RouteHandler}     from 'react-router';

import MainHeader         from 'app/main/main-layout-header';

var MainLayout = React.createClass({

    render() {
        return (
            <div className="main-layout">

                <MainHeader />

                <RouteHandler params={this.props.params}
                    query={this.props.query} />

                MainFooter

            </div>
        );
    }
});

export default MainLayout;