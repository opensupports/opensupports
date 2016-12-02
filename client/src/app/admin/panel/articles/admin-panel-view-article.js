import React from 'react';
import _ from 'lodash';
import {connect}  from 'react-redux';

import ArticlesActions from 'actions/articles-actions';
import SessionStore from 'lib-app/session-store';
import i18n from 'lib-app/i18n';
import DateTransformer from 'lib-core/date-transformer';

import Header from 'core-components/header';
import Loading from 'core-components/loading';

class AdminPanelViewArticle extends React.Component {

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
        return (
            <div className="admin-panel-view-article__article">
                <Header title={article.title}/>

                <div className="admin-panel-view-article__content">
                    <div dangerouslySetInnerHTML={{__html: article.content}}/>
                </div>
                <div className="admin-panel-view-article__last-edited">
                    {i18n('LAST_EDITED_IN', {date: DateTransformer.transformToString(article.lastEdited)})}
                </div>
            </div>
        );
    }

    findArticle() {
        let article = null;

        _.forEach(this.props.topics, (topic) => {
            if(!article) {
                article = _.find(topic.articles, {id: this.props.params.articleId * 1});
            }
        });

        return article;
    }
}

export default connect((store) => {
    return {
        topics: store.articles.topics,
        loading: store.articles.loading
    };
})(AdminPanelViewArticle);
