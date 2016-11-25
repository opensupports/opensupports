import React from 'react';

import API from 'lib-app/api-call';
import TopicViewer from 'app-components/topic-viewer';

class AdminPanelListArticles extends React.Component {

    state = {
        loading: true,
        topics: []
    };

    componentDidMount() {
        API.call({
            path: '/article/get-all',
            data: {}
        }).then(this.onRetrieveSuccess.bind(this));
    }

    render() {
        return (
            <div>
                {this.state.loading ? 'loading' : this.renderTopics()}
            </div>
        );
    }

    renderTopics() {
        return (
            <div>
                {this.state.topics.map(function (topic) {
                    return <TopicViewer {...topic} />
                })}
            </div>
        )
    }

    onRetrieveSuccess(result) {
        this.setState({
            loading: false,
            topics: result.data
        });
    }
}

export default AdminPanelListArticles;