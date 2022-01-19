import React from 'react';
import _ from 'lodash';
import {connect}  from 'react-redux';
import history from 'lib-app/history';

import ArticlesActions from 'actions/articles-actions';
import SessionStore from 'lib-app/session-store';
import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';
import MentionsParser from 'lib-app/mentions-parser';
import DateTransformer from 'lib-core/date-transformer';

import AreYouSure from 'app-components/are-you-sure';
import Header from 'core-components/header';
import Loading from 'core-components/loading';
import Button from 'core-components/button';
import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import SubmitButton from 'core-components/submit-button';
import TextEditor from 'core-components/text-editor';
import Icon from 'core-components/icon';

class AdminPanelViewArticle extends React.Component {

    static propTypes = {
        topics: React.PropTypes.array,
        loading: React.PropTypes.bool,
        allowAttachments: React.PropTypes.bool
    };

    static defaultProps = {
        topics: [],
        loading: true
    };

    state = {
        editable: false
    };

    componentDidMount() {
        if(SessionStore.getItem('topics')) {
            this.props.dispatch(ArticlesActions.initArticles());
        } else {
            this.props.dispatch(ArticlesActions.retrieveArticles());
        }
    }

    render() {
        return (
            <div className="admin-panel-view-article">
                {(this.props.loading) ? <Loading /> : this.renderContent()}
            </div>
        );
    }

    renderContent() {
        let article = this.findArticle();

        return (article) ? this.renderArticle(article) : i18n('ARTICLE_NOT_FOUND');
    }

    renderArticle(article) {
        return (this.state.editable) ? this.renderArticleEdit(article) : this.renderArticlePreview(article);
    }

    renderArticlePreview(article) {
        return (
            <div className="admin-panel-view-article__content">
                <div className="admin-panel-view-article__header-wrapper">
                    <Header title={article.title} />
                    <div className="admin-panel-view-article__header-buttons">
                        <span onClick={this.onEditClick.bind(this, article)}>
                            <Icon className="admin-panel-view-article__edit-icon" name="pencil" />
                        </span>
                        <span onClick={this.onDeleteClick.bind(this, article)} >
                            <Icon className="admin-panel-view-article__edit-icon" name="trash" />
                        </span>
                    </div>
                </div>
                <div className="admin-panel-view-article__article-content ql-editor">
                    <div dangerouslySetInnerHTML={{__html: MentionsParser.parse(article.content)}}/>
                </div>
                <div className="admin-panel-view-article__last-edited">
                    {i18n('LAST_EDITED_IN', {date: DateTransformer.transformToString(article.lastEdited)})}
                </div>
            </div>
        );
    }

    renderArticleEdit() {
        return (
            <Form values={this.state.form} onChange={(form) => this.setState({form})} onSubmit={this.onFormSubmit.bind(this)}>
                <div className="admin-panel-view-article__buttons">
                    <Button className="admin-panel-view-article__button" size="medium" onClick={this.onFormCancel.bind(this)}>
                        {i18n('CANCEL')}
                    </Button>
                    <SubmitButton className="admin-panel-view-article__button" type="secondary" size="medium">{i18n('SAVE')}</SubmitButton>
                </div>
                <FormField name="title" label={i18n('TITLE')} />
                <FormField name="content" label={i18n('CONTENT')} field="textarea" validation="TEXT_AREA" required  fieldProps={{allowImages: this.props.allowAttachments}}/>     
            </Form>
        );
    }

    findArticle() {
        let article = null;

        _.forEach(this.props.topics, (topic) => {
            if(!article) {
                article = _.find(topic.articles, {id: this.props.params.articleId});
            }
        });

        return article;
    }

    onEditClick(article) {
        this.setState({
            editable: true,
            form: {
                title: article.title,
                content: TextEditor.getEditorStateFromHTML(article.content)
            }
        });
    }

    onDeleteClick(article) {
        AreYouSure.openModal(i18n('DELETE_ARTICLE_DESCRIPTION'), this.onArticleDeleted.bind(this, article));
    }

    onFormSubmit(form) {
        API.call({
            path: '/article/edit',
            dataAsForm: true,
            data: _.extend(TextEditor.getContentFormData(form.content), {
                articleId: this.findArticle().id,
                title: form.title
            })
        }).then(() => {
            this.props.dispatch(ArticlesActions.retrieveArticles());
            this.setState({
                editable: false
            });
        });
    }

    onFormCancel(event) {
        event.preventDefault();

        this.setState({
            editable: false
        });
    }

    onArticleDeleted(article) {
        return API.call({
            path: '/article/delete',
            data: {
                articleId: article.id
            }
        }).then(() => history.push('/admin/panel/articles/list-articles'));
    }
}

export default connect((store) => {
    return {
        allowAttachments: store.config['allow-attachments'],
        topics: store.articles.topics,
        loading: store.articles.loading
    };
})(AdminPanelViewArticle);
