import React from 'react';

import i18n from 'lib-app/i18n';

import Header from 'core-components/header';
import Listing from 'core-components/listing';
import Loading from 'core-components/loading';

class AdminPanelCustomResponses extends React.Component {

    render() {
        return (
            <div className="admin-panel-custom-responses">
                <Header title={i18n('CUSTOM_RESPONSES')} description={i18n('CUSTOM_RESPONSES_DESCRIPTION')} />
                {(this.props.loaded) ? this.renderContent() : this.renderLoading()}
            </div>
        );
    }

    renderContent() {
        return (
            <div className="row">
                <div className="col-md-3">
                    <Listing {...this.getListingProps()}/>
                </div>
                <div className="col-md-9">
                    Custom response form
                </div>
            </div>
        );
    }

    renderLoading() {
        return (
            <div className="admin-panel-custom-responses__loading">
                <Loading backgrounded size="large"/>
            </div>
        );
    }

    getListingProps() {
        return {
            title: 'Custom Responses',
            items: [{content: 'Connection issue'}, {content: 'Change existent name'}, {content: 'Connection issue'}],
            enableAddNew: true
        };
    }
}

export default AdminPanelCustomResponses;