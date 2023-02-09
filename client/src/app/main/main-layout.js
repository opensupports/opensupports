import React              from 'react';

import MainHeader         from 'app/main/main-layout-header';
import MainFooter         from 'app/main/main-layout-footer';

class MainLayout extends React.Component {

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
}

export default MainLayout;
