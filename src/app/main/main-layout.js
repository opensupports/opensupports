import React              from 'react/addons';
import {RouteHandler}     from 'react-router';

import MainHeader         from 'app/main/main-layout-header';
import MainFooter         from 'app/main/main-layout-footer';
import {TransitionMotion, spring} from 'react-motion';
import RouteTransition from 'utils/route-transition';

var MainLayout = React.createClass({

    render() {
        return (
            <div className="main-layout">

                <MainHeader />

                <div className="main-layout--content">
                    {this.props.children}
                </div>

                <MainFooter />

            </div>
        );
    }
});

export default MainLayout;