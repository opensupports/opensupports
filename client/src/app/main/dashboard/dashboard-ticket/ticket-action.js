import React from 'react';
import classNames from 'classnames';

import i18n from 'lib-app/i18n';
import Icon from 'core-components/icon';

class TicketAction extends React.Component {
    static propTypes = {
        type: React.PropTypes.oneOf(['comment', 'assign']),
        config: React.PropTypes.object
    };

    static defaultProps = {
        type: 'comment'
    };

    render() {
        return (
            <div className={this.getClass()}>
                <span className="ticket-action__connector" />
                <div className="col-md-1">
                    <div className="ticket-action__icon">
                        <Icon name="comment-o" size="2x" />
                    </div>
                </div>
                <div className="col-md-11">
                    {this.renderActionDescription()}
                </div>
            </div>
        );
    }

    renderActionDescription() {
        const renders = {
            'comment': this.renderComment.bind(this),
            'assign': this.renderAssignment.bind(this)
        };

        return renders[this.props.type]();
    }

    renderComment() {
        const {config} = this.props;

        return (
            <div className="ticket-action__comment">
                <span className="ticket-action__comment-pointer" />
                <div className="ticket-action__comment-author">
                    <span className="ticket-action__comment-author-name">{config.author.name}</span>
                    <span className="ticket-action__comment-author-type">({i18n((config.author.staff) ? 'STAFF' : 'CUSTOMER')})</span>
                </div>
                <div className="ticket-action__comment-date">{config.date}</div>
                <div className="ticket-action__comment-content" dangerouslySetInnerHTML={{__html: config.content}}></div>
                {this.renderFileRow(config.file)}
            </div>
        );
    }

    renderAssignment() {
        // TODO: Add actions architecture instead of just comments

        return (
            <div className="ticket-action__assignment">
            </div>
        )
    }

    renderFileRow(file) {
        let node = null;

        if (file) {
            node = <span> {this.getFileLink(file)} <Icon name="paperclip" /> </span>;
        } else {
            node = i18n('NO_ATTACHMENT');
        }

        return (
            <div className="ticket-viewer__file">
                {node}
            </div>
        )
    }

    getClass() {
        const {config} = this.props;
        
        let classes = {
            'row': true,
            'ticket-action': true,
            'ticket-action_staff': config.author && config.author.staff
        };

        return classNames(classes);
    }

    getFileLink(filePath = '') {
        const fileName = filePath.replace(/^.*[\\\/]/, '');

        return (
            <a href={filePath} target="_blank">{fileName}</a>
        )
    }
}

export default TicketAction;