import React from 'react';
import {connect}  from 'react-redux';

import i18n from 'lib-app/i18n';
import ArticlesActions from 'actions/articles-actions';

import TopicViewer from 'app-components/topic-viewer';
import ModalContainer from 'app-components/modal-container';
import TopicEditModal from 'app-components/topic-edit-modal';

import Loading from 'core-components/loading';
import Button from 'core-components/button';
import Icon from 'core-components/icon';
import Message from 'core-components/message';

class ArticlesList extends React.Component {

    static propTypes = {
        editable: React.PropTypes.bool,
        articlePath: React.PropTypes.string,
        loading: React.PropTypes.bool,
        errored: React.PropTypes.bool,
        topics: React.PropTypes.array,
        retrieveOnMount: React.PropTypes.bool
    };

    static defaultProps = {
        editable: true,
        retrieveOnMount: true
    };

    componentDidMount() {
        if(this.props.retrieveOnMount) {
            this.retrieveArticles();
        }
    }

    render() {
        const { errored, loading } = this.props;

        if(errored) {
            return <Message showCloseButton={false} type="error">{i18n('ERROR_RETRIEVING_ARTICLES')}</Message>;
        }

        return loading ? <Loading className="articles-list__loading" backgrounded size="large"/> : this.renderContent();
    }

    renderContent() {
        return (
            <div className="articles-list">
                {this.renderTopics()}
                {(this.props.editable) ? this.renderAddTopicButton() : null}
            </div>
        );
    }

    renderTopics() {
        const { topics, editable, articlePath } = this.props;

        return (
            <div className="articles-list__topics">
                {topics.map((topic, index) => {
                    return (
                        <div key={index}>
                            <TopicViewer
                                {...topic}
                                id={topic.id * 1}
                                editable={editable}
                                onChange={this.retrieveArticles.bind(this)}
                                articlePath={articlePath} />
                            <span className="separator" />
                        </div>
                    );
                })}
            </div>
        );
    }

    renderAddTopicButton() {
        return (
            <div className="articles-list__add-topic-button">
                <Button onClick={() => ModalContainer.openModal(<TopicEditModal addForm onChange={this.retrieveArticles.bind(this)} />)} type="secondary" className="articles-list__add">
                    <Icon name="plus" className="articles-list__add-icon" /> {i18n('ADD_TOPIC')}
                </Button>
            </div>
        );
    }

    retrieveArticles() {
        this.props.dispatch(ArticlesActions.retrieveArticles());
    }
}

export default connect((store) => {
    const { topics, errored, loading } = store.articles;

    return {
        topics: topics.map((topic) => {return {...topic, private: topic.private === "1"}}),
        errored,
        loading
    };
})(ArticlesList);
