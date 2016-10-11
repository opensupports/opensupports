import React from 'react';
import {connect}  from 'react-redux';

import i18n from 'lib-app/i18n';

import AdminDataActions from 'actions/admin-data-actions';
import Header from 'core-components/header';
import Listing from 'core-components/listing';
import Loading from 'core-components/loading';

class AdminPanelCustomResponses extends React.Component {
    static defaultProps = {
        items: []
    };
    
    componentDidMount() {
        if (!this.props.loaded) {
            this.props.dispatch(AdminDataActions.retrieveCustomResponses());
        }
    }

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
            items: this.getItems(),
            enableAddNew: true
        };
    }

    getItems() {
        return this.props.items.map((item) => {
            return {
                content: item.name
            };
        });
    }
}

export default connect((store) => {
    return {
        loaded: store.adminData.customResponsesLoaded,
        items: store.adminData.customResponses
    };
})(AdminPanelCustomResponses);
