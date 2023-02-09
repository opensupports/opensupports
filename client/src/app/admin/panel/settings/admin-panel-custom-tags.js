import React from 'react';
import {connect}  from 'react-redux';

import AdminPanelCustomTagsModal from 'app/admin/panel/settings/admin-panel-custom-tags-modal';

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
                        <Icon className="admin-panel-custom-tags__add-button-icon" name="plus" /> {i18n('ADD_CUSTOM_TAG')}
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
                <Tag
                    color={tag.color}
                    name={tag.name}
                    onEditClick={this.openEditTagModal.bind(this, tag.id, tag.name, tag.color)}
                    onRemoveClick={this.onDeleteClick.bind(this, tag.id)}
                    size='large'
                    showEditButton
                    showDeleteButton />
            </div>
        )
    }

    openTagModal() {
        ModalContainer.openModal(
            <AdminPanelCustomTagsModal onTagCreated={this.retrieveCustomTags.bind(this)} createTag />
        );
    }
    
    openEditTagModal(tagId,tagName,tagColor, event) {
        ModalContainer.openModal(
            <AdminPanelCustomTagsModal defaultValues={{name: tagName , color: tagColor}} id={tagId} onTagChange={this.retrieveCustomTags.bind(this)} />
        );
    }

    onDeleteClick(tagId, event) {
        event.preventDefault();
        AreYouSure.openModal(i18n('WILL_DELETE_CUSTOM_TAG'), this.deleteCustomTag.bind(this, tagId));
    }

    deleteCustomTag(tagId) {
        return API.call({
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
        tags: store.config['tags'].map((tag) => {return {...tag, id: tag.id*1}})
    };
})(AdminPanelCustomTags);
