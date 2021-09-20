import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import {connect}  from 'react-redux';

import ArticlesActions from 'actions/articles-actions';
import SessionStore from 'lib-app/session-store';
import i18n from 'lib-app/i18n';
import DateTransformer from 'lib-core/date-transformer';

import Header from 'core-components/header';
import Loading from 'core-components/loading';
import BreadCrumb from 'core-components/breadcrumb';
import Widget from 'core-components/widget';

class DashboardArticlePage extends React.Component {

    static propTypes = {
        topics: React.PropTypes.array,
        loading: React.PropTypes.bool
    };

    static defaultProps = {
        topics: [],
        loading: true
    };

    componentDidMount() {
        if(SessionStore.getItem('topics')) {
            this.props.dispatch(ArticlesActions.initArticles());
        } else {
            this.props.dispatch(ArticlesActions.retrieveArticles());
        }
    }

    render() {
        let Wrapper = 'div';

        if(_.startsWith(this.props.location.pathname, '/article/')) {
            Wrapper = Widget;
        }

        return (
            <div className={this.getClass()}>
                <Wrapper>
                    <div className="dashboard-article-page__breadcrumb">
                        <BreadCrumb items={this.getBreadCrumbItems()}/>
                    </div>
                    {(this.props.loading) ? <Loading /> : this.renderContent()}
                </Wrapper>
            </div>
        );
    }

    renderContent() {
        let article = this.findArticle();

        return (article) ? this.renderArticlePreview(article) : i18n('ARTICLE_NOT_FOUND');
    }

    renderArticlePreview(article) {
        return (
            <div className="dashboard-article-page__article">
                <Header title={article.title}/>

                <div className="dashboard-article-page__article-content ql-editor">
                    <div dangerouslySetInnerHTML={{__html: article.content}}/>
                </div>
                <div className="dashboard-article-page__last-edited">
                    {i18n('LAST_EDITED_IN', {date: DateTransformer.transformToString(article.lastEdited)})}
                </div>
            </div>
        );
    }
    
    getClass() {
        let classes = {
            'dashboard-article-page': true,
            'dashboard-article-page_wrapped': _.startsWith(this.props.location.pathname, '/dashboard/article/')
        };

        return classNames(classes);
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

    findTopic() {
        let topicFound = {};

        _.forEach(this.props.topics, (topic) => {
            if(_.find(topic.articles, {id: this.props.params.articleId})) {
                topicFound = topic;
            }
        });

        return topicFound;
    }

    getBreadCrumbItems() {
        let article = this.findArticle();
        let topic = this.findTopic();
        let items = [
            {content: i18n('ARTICLES'), url: (_.startsWith(this.props.location.pathname, '/article/')) ? '/articles' : '/dashboard/articles'}
        ];

        if(topic && topic.name) {
            items.push({content: topic.name, url: (_.startsWith(this.props.location.pathname, '/article/')) ? '/articles' : '/dashboard/articles'});
        }

        if(article && article.title) {
            items.push({content: article.title});
        }

        return items;
    }
}

export default connect((store) => {
    return {
        topics: store.articles.topics,
        loading: store.articles.loading
    };
})(DashboardArticlePage);
