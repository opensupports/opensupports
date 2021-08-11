import React from 'react';
import classNames from 'classnames';
import {connect}  from 'react-redux';
import _ from 'lodash';
import {Link} from 'react-router';

import i18n from 'lib-app/i18n';
import ArticlesList from 'app-components/articles-list';
import ArticlesActions from 'actions/articles-actions';

import Header from 'core-components/header';
import SearchBox from 'core-components/search-box';
import Widget from 'core-components/widget';

class DashboardListArticlesPage extends React.Component {

    state = {
        results: [],
        showSearchResults: false
    };

    componentDidMount() {
        this.props.dispatch(ArticlesActions.retrieveArticles());
    }

    render() {
        let Wrapper = 'div';

        if(this.props.location.pathname == '/articles') {
            Wrapper = Widget;
        }

        return (
            <div className={this.getClass()}>
                <Wrapper>
                    <Header title={i18n('LIST_ARTICLES')} description={i18n('LIST_ARTICLES_DESCRIPTION')}/>
                    <SearchBox
                        className="dashboard-list-articles-page__search-box"
                        onSearch={this.onSearch.bind(this)}
                        searchOnType />
                    {(!this.state.showSearchResults) ? this.renderArticleList() : this.renderSearchResults()}
                </Wrapper>
            </div>
        );
    }

    renderArticleList() {
        let articlePath = (this.props.location.pathname == '/articles') ? '/article/' : '/dashboard/article/';
        
        return (
            <ArticlesList editable={false} articlePath={articlePath} retrieveOnMount={false}/>
        );
    }

    renderSearchResults() {
        return (
            <div className="dashboard-list-articles-page__search-results">
                {(_.isEmpty(this.state.results)) ?
                    i18n('NO_RESULTS') :
                        this.state.results.map(this.renderSearchResultsItem.bind(this))}
            </div>
        );
    }

    renderSearchResultsItem(item, index) {
        let content = this.stripHTML(item.content);
        content = content.substring(0, 100);
        content += '...';

        return (
            <div className="dashboard-list-articles-page__search-result" key={index}>
                <div className="dashboard-list-articles-page__search-result-title">
                    <Link
                        to={
                            ((this.props.location.pathname == '/articles') ? '/article/' : '/dashboard/article/') +
                            item.id
                        }>
                        {item.title}
                    </Link>
                </div>
                <div className="dashboard-list-articles-page__search-result-description">{content}</div>
                <div className="dashboard-list-articles-page__search-result-topic">{item.topic}</div>
            </div>
        );
    }

    getClass() {
        let classes = {
            'dashboard-list-articles-page': true,
            'dashboard-list-articles-page_wrapped': (this.props.location.pathname == '/dashboard/articles'),
            'col-md-10 col-md-offset-1': !this.props.isLogged
        };

        return classNames(classes);
    }

    onSearch(query) {
        this.setState({
            results:
                SearchBox.searchQueryInList(this.getArticles(),
                query,
                this.isQueryInTitle.bind(this),
                this.isQueryInContent.bind(this)),
            showSearchResults: query.length
        });
    }

    getArticles() {
        let articles = [];

        _.forEach(this.props.topics, (topic) => {
            _.forEach(topic.articles, (article) => {
                articles.push({
                    id: article.id,
                    title: article.title,
                    content: article.content,
                    topic: topic.name
                });
            });
        });

        return articles;
    }

    isQueryInTitle(article, query) {
        return _.includes(article.title.toLowerCase(), query.toLowerCase());
    }

    isQueryInContent(article, query) {
        return _.includes(article.content.toLowerCase(), query.toLowerCase());
    }

    stripHTML(html){
        let tmp = document.createElement('DIV');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    }
}


export default connect((store) => {
    return {
        isLogged: store.session.logged,
        config: store.config,
        topics: store.articles.topics.map((topic) => {return {...topic, private: topic.private === "1"}}),
        loading: store.articles.loading
    };
})(DashboardListArticlesPage);
