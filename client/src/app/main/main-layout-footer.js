import React              from 'react';

class MainLayoutFooter extends React.Component {

    render() {
        return (
            <div className="main-layout-footer">
                <div className="main-layout-footer--powered">
                    Powered by <a className="main-layout-footer--os-link" href="http://www.opensupports.com/" target="_blank">OpenSupports</a>
                </div>
            </div>
        );
    }
}

export default MainLayoutFooter;