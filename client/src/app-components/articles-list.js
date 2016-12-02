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

class ArticlesList extends React.Component {

    static propTypes = {
        editable: React.PropTypes.bool,
        loading: React.PropTypes.bool,
        topics: React.PropTypes.array
    };

    static defaultProps = {
        editable: true
    };

    componentDidMount() {
        this.retrieveArticles();
    }

    render() {
        return (this.props.loading) ? <Loading /> : this.renderContent();
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
        return (
            <div className="articles-list__topics">
                {this.props.topics.map((topic, index) => {
                    return (
                        <div key={index}>
                            <TopicViewer {...topic} editable={this.props.editable} onChange={this.retrieveArticles.bind(this)}/>
                            <span className="articles-list__topic-separator" />
                        </div>
                    );
                })}
            </div>
        );
    }

    renderAddTopicButton() {
        return (
            <div className="articles-list__add-topic-button">
                <Button onClick={() => ModalContainer.openModal(<TopicEditModal addForm/>)} type="secondary" className="articles-list__add">
                    <Icon name="plus-circle" size="2x" className="articles-list__add-icon"/> {i18n('ADD_TOPIC')}
                </Button>
            </div>
        );
    }

    retrieveArticles() {
        this.props.dispatch(ArticlesActions.retrieveArticles());
    }
}

export default connect((store) => {
    return {
        topics: store.articles.topics,
        loading: store.articles.loading
    };
})(ArticlesList);
