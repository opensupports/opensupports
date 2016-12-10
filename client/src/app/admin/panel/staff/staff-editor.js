import React from 'react';
import _ from 'lodash';

import i18n from 'lib-app/i18n';
import API from 'lib-app/api-call';

import Form from 'core-components/form';
import FormField from 'core-components/form-field';
import SubmitButton from 'core-components/submit-button';

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
                            <Form>
                                <FormField name="email" validation="EMAIL" required/>
                                <SubmitButton>{i18n('UPDATE_EMAIL')}</SubmitButton>
                            </Form>
                            <span className="staff-editor__separator" />
                            <Form>
                                <FormField name="password" validation="EMAIL" required/>
                                <FormField name="rpassword" validation="EMAIL" required/>
                                <SubmitButton>{i18n('UPDATE_PASSWORD')}</SubmitButton>
                            </Form>
                            <span className="staff-editor__separator" />
                            <Form>
                                <FormField name="level" label={i18n('LEVEL')} field="select" fieldProps={{
                                    items: [{content: i18n('LEVEL_1')}, {content: i18n('LEVEL_2')}, {content: i18n('LEVEL_3')}],
                                    size: 'large'
                                }} />
                                <SubmitButton>{i18n('UPDATE_LEVEL')}</SubmitButton>
                            </Form>
                            <span className="staff-editor__separator" />
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