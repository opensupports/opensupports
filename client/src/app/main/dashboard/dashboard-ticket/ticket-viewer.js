import React from 'react';
import classNames from 'classnames';

import Icon from 'core-components/icon';

class TicketViewer extends React.Component {
    static propTypes = {
        ticket: React.PropTypes.object
    };

    static defaultProps = {
        ticket: {
            author: {},
            department: {},
            comments: []
        }
    };

    render() {
        return (
            <div className="ticket-viewer">
                <div className="ticket-viewer__header row">
                    <span className="ticket-viewer__number">#{this.props.ticket.ticketNumber}</span>
                    <span className="ticket-viewer__title">{this.props.ticket.title}</span>
                </div>
                <div className="ticket-viewer__info-row-header row">
                    <div className="ticket-viewer__department col-md-4">Department</div>
                    <div className="ticket-viewer__author col-md-4">Author</div>
                    <div className="ticket-viewer__date col-md-4">Date</div>
                </div>
                <div className="ticket-viewer__info-row-values row">
                    <div className="ticket-viewer__department col-md-4">{this.props.ticket.department.name}</div>
                    <div className="ticket-viewer__author col-md-4">{this.props.ticket.author.name}</div>
                    <div className="ticket-viewer__date col-md-4">{this.props.ticket.date}</div>
                </div>
                <div className="ticket-viewer__content">
                    {this.renderComment(this.props.ticket)}
                </div>
                <div className="ticket-viewer__comments">
                    {this.props.ticket.comments.map(this.renderComment.bind(this))}
                </div>
                <div className="ticket-viewer__response">
                    <div className="ticket-viewer__response-title row">Respond</div>
                    <div className="ticket-viewer__response-field row">Response field</div>
                </div>
            </div>
        );
    }

    renderComment(comment) {
        const iconNode = (
            <div className="col-md-1">
                <div className="ticket-viewer__comment-action">
                    <Icon name="comment-o" size="2x" />
                </div>
            </div>
        );
        const commentNode = (
            <div className="col-md-11">
                <div className="ticket-viewer__comment">
                    <span className="ticket-viewer__comment-pointer" />
                    <div className="ticket-viewer__comment-author">
                        <span className="ticket-viewer__comment-author-name">
                            {comment.author.name}
                        </span>
                    </div>
                    <div className="ticket-viewer__comment-date">{comment.date}</div>
                    <div className="ticket-viewer__comment-content">{comment.content}</div>
                    {this.renderFileRow(comment.file)}
                </div>
            </div>
        );

        return (
            <div className={this.getActionClass(comment)}>
                {comment.author.staff ? [commentNode, iconNode] : [iconNode, commentNode]}
            </div>
        );
    }

    renderFileRow(file) {
        let node = null;

        if (file) {
            node = <span> {this.getFileLink(this.props.ticket.file)} <Icon name="paperclip" /> </span>;
        } else {
            node = 'No file attachment';
        }

        return (
            <div className="ticket-viewer__file">
                {node}
            </div>
        )
    }

    getActionClass(action) {
        let classes = {
            'row': true,
            'ticket-viewer__action': true,
            'ticket-viewer__action_staff': action.author.staff
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

export default TicketViewer;