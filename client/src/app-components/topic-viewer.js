import React from 'react';
import {Link} from 'react-router';

import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';
import ModalContainer from 'app-components/modal-container';
import TopicEditModal from 'app-components/topic-edit-modal';
import AreYouSure from 'app-components/are-you-sure';

import Header from 'core-components/header';
import Icon from 'core-components/icon';
import Button from 'core-components/button';

class TopicViewer extends React.Component {
    static propTypes = {
        topicId: React.PropTypes.number.isRequired,
        name: React.PropTypes.string.isRequired,
        icon: React.PropTypes.string.isRequired,
        iconColor: React.PropTypes.string.isRequired,
        articles: React.PropTypes.array.isRequired,
        articlePath: React.PropTypes.string,
        editable: React.PropTypes.bool
    };

    static defaultProps = {
        articlePath: '/admin/panel/articles/view-article/',
        editable: true
    };

    render() {
        return (
            <div className="topic-viewer">
                <div className="topic-viewer__header">
                    <Icon className="topic-viewer__icon" name={this.props.icon} color={this.props.iconColor}/>
                    <span className="topic-viewer__title">{this.props.name}</span>
                    {(this.props.editable) ? this.renderEditButton() : null}
                    {(this.props.editable) ? this.renderDeleteButton() : null}
                </div>
                <ul className="topic-viewer__list">
                    {this.props.articles.map(this.renderArticleItem.bind(this))}
                </ul>
            </div>
        );
    }

    renderEditButton() {
        return (
            <span onClick={() => {ModalContainer.openModal(this.renderEditModal());}}>
                <Icon className="topic-viewer__edit-icon" name="pencil" />
            </span>
        );
    }

    renderDeleteButton() {
        return (
            <span onClick={AreYouSure.openModal.bind(this, i18n('DELETE_TOPIC_DESCRIPTION'), this.onDeleteClick.bind(this))}>
                <Icon className="topic-viewer__edit-icon" name="trash" />
            </span>
        );
    }

    renderArticleItem(article, index) {
        return (
            <li className="topic-viewer__list-item" key={index}>
                <Link className="topic-viewer__list-item-button" to={this.props.articlePath + article.id}>
                    {article.title}
                </Link>
            </li>
        );
    }

    renderEditModal() {
        let props = {
            topicId: this.props.topicId,
            defaultValues: {
                title: this.props.name,
                icon: this.props.icon,
                iconColor: this.props.iconColor
            }
        };

        return (
            <TopicEditModal {...props} />
        );
    }

    onDeleteClick() {
        API.call({
            path: '/article/delete-topic',
            data: {
                topicId: this.props.topicId
            }
        }).then(this.onChange.bind(this));
    }

    onChange() {
        if(this.props.onChange) {
            this.props.onChange();
        }
    }
}

export default TopicViewer;