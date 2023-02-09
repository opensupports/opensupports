import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import classNames from 'classnames';
import {Link} from 'react-router';

import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';
import ModalContainer from 'app-components/modal-container';
import TopicEditModal from 'app-components/topic-edit-modal';
import AreYouSure from 'app-components/are-you-sure';
import ArticleAddModal from 'app-components/article-add-modal';

import Icon from 'core-components/icon';
import Button from 'core-components/button';

class TopicViewer extends React.Component {
    static propTypes = {
        id: React.PropTypes.number.isRequired,
        name: React.PropTypes.string.isRequired,
        icon: React.PropTypes.string.isRequired,
        iconColor: React.PropTypes.string.isRequired,
        articles: React.PropTypes.array.isRequired,
        articlePath: React.PropTypes.string,
        editable: React.PropTypes.bool,
        private: React.PropTypes.bool
    };

    static defaultProps = {
        articlePath: '/admin/panel/articles/view-article/',
        editable: true
    };

    state = {
        articles: this.props.articles.sort((a, b) => {
            return (a.position*1) - (b.position*1);
        }),
        currentDraggedId: 0
    };

    componentWillReceiveProps(nextProps) {
        this.setState({
            articles: nextProps.articles.sort((a, b) => {
                return (a.position*1) - (b.position*1);
            })
        });
    }

    render() {
        return (
            <div className="topic-viewer">
                <div className="topic-viewer__header">
                    <Icon className="topic-viewer__icon" name={this.props.icon} color={this.props.iconColor}/>
                    <span className="topic-viewer__title">{this.props.name}</span>
                    {(this.props.editable) ? this.renderEditButton() : null}
                    {(this.props.editable) ? this.renderDeleteButton() : null}
                    {this.props.private*1 ? <Icon className="topic-viewer__private" name='user-secret' color='grey'/> : null}

                </div>
                <ul className="topic-viewer__list">
                    {this.state.articles.map(this.renderArticleItem.bind(this))}
                    {(this.props.editable) ? this.renderAddNewArticle() : null}
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
            <span onClick={() => AreYouSure.openModal(i18n('DELETE_TOPIC_DESCRIPTION'), this.onDeleteClick.bind(this))}>
                <Icon className="topic-viewer__edit-icon" name="trash" />
            </span>
        );
    }

    renderArticleItem(article, index) {
        let props = {
            className: 'topic-viewer__list-item',
            key: index,
            draggable: true
        };

        if(this.props.editable) {
            _.extend(props, {
                onDragOver: (this.state.currentDraggedId) ? this.onItemDragOver.bind(this, article, index) : null,
                onDrop: (this.state.currentDraggedId) ? this.onItemDrop.bind(this, article, index) : null,
                onDragStart: () => {
                    this.setState({currentDraggedId: article.id})
                },
                onDragEnd: () => {
                    if(this.state.currentDraggedId) {
                        this.setState({articles: this.props.articles, currentDraggedId: 0});
                    }
                }
            });
        }

        return (
            <li {...props}>
                <Link {...this.getArticleLinkProps(article, index)}>
                    {article.title}
                </Link>
                {(this.props.editable) ? <Icon className="topic-viewer__grab-icon" name="arrows" ref={'grab-' + index}/> : null}
            </li>
        );
    }

    renderAddNewArticle() {
        return (
            <li className="topic-viewer__list-item">
                <Button type="link" className="topic-viewer__add-item" onClick={() => ModalContainer.openModal(this.renderAddNewArticleModal())}>
                    {i18n('ADD_NEW_ARTICLE')}
                </Button>
            </li>
        );
    }

    renderEditModal() {
        const {id, onChange, name, icon, iconColor} = this.props;

        const props = {
            topicId: id,
            onChange,
            defaultValues: {
                title: name,
                icon,
                color: iconColor,
                private: this.props.private * 1
            }
        };

        return (
            <TopicEditModal {...props} />
        );
    }

    renderAddNewArticleModal() {
        let props = {
            topicId: this.props.id,
            position: this.props.articles.length,
            onChange: this.props.onChange,
            topicName: this.props.name
        };

        return (
            <ArticleAddModal {...props}/>
        );
    }

    getArticleLinkProps(article) {
        let classes = {
            'topic-viewer__list-item-button': true,
            'topic-viewer__list-item-hidden': article.hidden
        };

        return {
            className: classNames(classes),
            to: this.props.articlePath + article.id
        };
    }

    onDeleteClick() {
        return API.call({
            path: '/article/delete-topic',
            data: {
                topicId: this.props.id
            }
        }).then(this.onChange.bind(this));
    }

    onItemDragOver(article, index, event) {
        event.preventDefault();

        if(!article.hidden) {
            let articles = [];
            let draggedId = this.state.currentDraggedId;
            let draggedIndex = _.findIndex(this.props.articles, {id: draggedId});

            _.forEach(this.props.articles, (current, currentIndex) => {
                if(draggedIndex < index) {
                    if(current.id !== draggedId) {
                        articles.push(current);
                    }

                    if(index === currentIndex) {
                        articles.push({
                            id: article.id,
                            title: 'X',
                            hidden: true
                        });
                    }
                } else {
                    if(index === currentIndex) {
                        articles.push({
                            id: article.id,
                            title: 'X',
                            hidden: true
                        });
                    }

                    if(current.id !== draggedId) {
                        articles.push(current);
                    }
                }
            });

            this.setState({articles});
        }
    }

    onItemDrop(article, index, event) {
        event.stopPropagation();
        event.preventDefault();
        let articles = [];
        let draggedId = this.state.currentDraggedId;
        let dragged = _.find(this.props.articles, {id: draggedId});
        let draggedIndex = _.findIndex(this.props.articles, {id: draggedId});

        _.forEach(this.props.articles, (current) => {
            if(current.id !== draggedId) {
                if(draggedIndex < index) {
                    articles.push(current);

                    if(current.id === article.id) {
                        articles.push(dragged);
                    }
                } else {
                    if(current.id === article.id) {
                        articles.push(dragged);
                    }

                    articles.push(current);
                }
            }
        });

        if(draggedIndex === index) {
            this.setState({articles: this.props.articles, currentDraggedId: 0});
        } else {
            this.updatePositions(articles.map((article) => article.id));
            this.setState({articles, currentDraggedId: 0}, this.onChange.bind(this));
        }
    }

    updatePositions(positions) {
        _.forEach(positions, (id, index) => {
            if(this.props.articles[index].id !== id) {
                API.call({
                    path: '/article/edit',
                    data: {
                        articleId: id,
                        position: index + 1
                    }
                });
            }
        });
    }

    onChange() {
        if(this.props.onChange) {
            this.props.onChange();
        }
    }
}

export default TopicViewer;
