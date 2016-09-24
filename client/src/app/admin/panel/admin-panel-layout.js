import React from 'react';
import MainLayout from 'app/main/main-layout';

class AdminPanel extends React.Component {

    render() {
        return (
            <MainLayout>
                <div>
                    THIS IS THE ADMIN PANEL
                </div>
                <div>
                    {this.props.children}
                </div>
            </MainLayout>
        );
    }
}

export default AdminPanel;