import React from 'react'
import Icon from 'core-components/icon'

class TopicViewer extends React.Component {
    static propTypes = {
        name: React.PropTypes.string.isRequired,
        icon: React.PropTypes.string.isRequired,
        iconColor: React.PropTypes.string.isRequired,
        articles: React.PropTypes.array.isRequired
    };

    render() {
        return (
            <div className="topic-viewer">
                <div className="topic-viewer__header">
                    <Icon className="topic-viewer__icon" name={this.props.icon} size="2x" color={this.props.iconColor}/>
                    <span className="topic-viewer__title">{this.props.name}</span>
                </div>
                <ul className="topic-viewer__list">
                    {this.props.articles.map(function (article) {
                        return <li className="topic-viewer__list-item">{article.title}</li>
                    })}
                </ul>
            </div>
        );
    }
}

export default TopicViewer;