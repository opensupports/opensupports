import React from 'react';
import _ from 'lodash';

import i18n from 'lib-app/i18n';

class StaffEditor extends React.Component {
    static propTypes = {
        name: React.PropTypes.string,
        profilePic: React.PropTypes.string,
        level: React.PropTypes.number,
        tickets: React.PropTypes.array,
        email: React.PropTypes.string,
        departments: React.PropTypes.array
    };
    
    render() {
        return (
            <div className="staff-editor">
                <div className="row">
                    <div className="col-md-4">
                        <div className="staff-editor__card">
                            <div className="staff-editor__card-data">
                                <div className="staff-editor__card-name">
                                    {this.props.name}
                                </div>
                                <div className="staff-editor__card-info">
                                    <div className="staff-editor__card-badge">
                                        <span className="staff-editor__card-badge-blue">
                                            {this.props.level}
                                        </span>
                                        <span className="staff-editor__card-badge-text">{i18n('STAFF_LEVEL')}</span>
                                    </div>
                                    <div className="staff-editor__card-badge">
                                        <span className="staff-editor__card-badge-green">
                                            {_.filter(this.props.tickets, {closed: false}).length}
                                        </span>
                                        <span className="staff-editor__card-badge-text">{i18n('ASSIGNED')}</span>
                                    </div>
                                    <div className="staff-editor__card-badge">
                                        <span className="staff-editor__card-badge-red">
                                            {_.filter(this.props.tickets, {closed: true}).length}
                                        </span>
                                        <span className="staff-editor__card-badge-text">{i18n('CLOSED')}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="staff-editor__card-pic-wrapper">
                                <img className="staff-editor__card-pic" src={this.props.profilePic} />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="staff-editor__form">
                            FORM
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <div className="staff-editor__departments">
                            DEPARTMENTS
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="staff-editor__activity">
                            ACTIVITY
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default StaffEditor;