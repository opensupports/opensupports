import React from 'react';
import {connect}  from 'react-redux';

import AdminPanelCustomTagsModal from 'app/admin/panel/tickets/admin-panel-custom-tags-modal';

import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';
import ConfigActions from 'actions/config-actions';

import AreYouSure from 'app-components/are-you-sure';
import ModalContainer from 'app-components/modal-container';

import Icon from 'core-components/icon';
import Button from 'core-components/button';
import Header from 'core-components/header';
import Tag from 'core-components/tag';

class AdminPanelCustomTags extends React.Component {
    static propTypes = {
        tags: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                name: React.PropTypes.string,
                color: React.PropTypes.string,
                id: React.PropTypes.number
            })
        ),
    };

    componentDidMount() {
        this.retrieveCustomTags();
    }

    render() {
        return (
            <div className="admin-panel-custom-tags">
                <Header title={i18n('CUSTOM_TAGS')} description={i18n('CUSTOM_TAGS_DESCRIPTION')} />
                {this.renderContent()}
            </div>
        );
    }

    renderContent() {
        return (
            <div className="admin-panel-custom-tags__content">
                <div>
                    <Button onClick={this.openTagModal.bind(this)}  type="secondary">
                        {i18n('ADD_CUSTOM_TAG')}<Icon className="admin-panel-custom-tags__add-button-icon" name="plus"/>
                    </Button>
                </div>
                <div className="admin-panel-custom-tags__tag-list">
                    {this.props.tags.map(this.renderTag.bind(this))}
                </div>
            </div>
        );
    }

    renderTag(tag, index) {
        return (
            <div key={index} className="admin-panel-custom-tags__tag-container" >
                <Tag color={tag.color} name={tag.name} onRemoveClick={this.onDeleteClick.bind(this, tag.id)} size='large' showDeleteButton />
            </div>
        )
    }

    openTagModal() {
        ModalContainer.openModal(
            <AdminPanelCustomTagsModal onTagCreated={this.retrieveCustomTags.bind(this)}/>
        );
    }

    onDeleteClick(tagId, event) {
        event.preventDefault();
        AreYouSure.openModal(i18n('WILL_DELETE_CUSTOM_RESPONSE'), this.deleteCustomTag.bind(this, tagId));
    }

    deleteCustomTag(tagId) {
        API.call({
            path: '/ticket/delete-tag',
            data: {
                tagId,
            }
        }).then(() => {
            this.retrieveCustomTags()
        });
    }

    retrieveCustomTags() {
        this.props.dispatch(ConfigActions.updateData());
    }
}

export default connect((store) => {
    return {
        tags: store.config['tags']
    };
})(AdminPanelCustomTags);
