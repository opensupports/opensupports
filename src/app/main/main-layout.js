import React              from 'react/addons';
import {RouteHandler}     from 'react-router';

import MainHeader         from 'app/main/main-layout-header';
import MainFooter         from 'app/main/main-layout-footer';

let MainLayout = React.createClass({

    render() {
        return (
            <div className="main-layout">

                <MainHeader />

                <div className="main-layout--content">
                    <RouteHandler params={this.props.params}
                        query={this.props.query} />
                </div>
                <MainFooter />

            </div>
        );
    }
});

export default MainLayout;